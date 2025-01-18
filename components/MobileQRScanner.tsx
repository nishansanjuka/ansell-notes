"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import {
  Camera,
  AlertCircle,
  Flashlight,
  FlashlightOff,
  Loader2 // Add this import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { default as NextImage } from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const MobileQRScanner: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlashlightSupported, setIsFlashlightSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // Add new state
  const webcamRef = useRef<Webcam | null>(null);
  const { signOut } = useClerk();

  const { push } = useRouter();

  const toggleFlashlight = useCallback(async () => {
    try {
      const stream = webcamRef.current?.video?.srcObject as MediaStream;
      if (!stream) return;

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
        torch: boolean;
      };

      if (capabilities.torch) {
        await track.applyConstraints({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          advanced: [{ torch: !isFlashlightOn }],
        });
        setIsFlashlightOn(!isFlashlightOn);
      } else {
        console.error("Flashlight not supported: torch not available");
      }
    } catch (err) {
      console.error("Flashlight not supported:", err);
    }
  }, [isFlashlightOn]);

  const checkFlashlightSupport = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");

      if (cameras.length === 0) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      setIsFlashlightSupported("torch" in capabilities);

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Error checking flashlight support:", err);
      setIsFlashlightSupported(false);
    }
  }, []);

  // Add initial permission check on mount
  useEffect(() => {
    const checkExistingPermission = async () => {
      try {
        const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        if (permissions.state === 'granted') {
          setHasPermission(true);
          checkFlashlightSupport();
        } else if (permissions.state === 'denied') {
          setError('Camera access was previously denied. Please update your browser settings.');
        }
        // If 'prompt', keep hasPermission as null to show request button
      } catch (err) {
        console.error('Error checking camera permission:', err);
      }
    };

    checkExistingPermission();
  }, [checkFlashlightSupport]);

  const requestCameraPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setHasPermission(true);
      setError(null);
      await checkFlashlightSupport();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    } catch (err: unknown) {
      setError(
        `Camera access denied. Please check your browser settings. ${err}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [checkFlashlightSupport]);

  const scanQRCode = useCallback(() => {
    if (!webcamRef.current || isScanning) return;
    
    const video = webcamRef.current.video;
    if (!video) return;
  
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
  
    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;
  
    context.drawImage(video, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    
    const code = jsQR(imageData.data, width, height);
    if (code) {
      setIsScanning(true);
      setTimeout(() => {
        push(`/machine?id=${code.data}`);
      }, 200); // Add delay to show animation
    }
  }, [push, isScanning]);

  // Update the scanning interval
  useEffect(() => {
    const interval = setInterval(scanQRCode, 200);
    return () => clearInterval(interval);
  }, [scanQRCode]);

  const handleCancelScan = () => {
    setHasPermission(null);
    signOut();
  };

  return (
    <div className="relative h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b z-50">
        <div className="flex items-center justify-between h-full px-4 overflow-hidden">
          <NextImage
            src="/logo.jpg"
            alt="logo"
            width={100}
            height={100}
            className="rounded-full"
          />
          <h1 className="text-foreground text-xl font-bold flex-1">Ansell Notes</h1>
          {/* {hasPermission && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHasPermission(null)}
            >
              <XCircle className="h-5 w-5" />
            </Button>
          )} */}
          <UserButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 h-full flex items-center justify-center p-4">
        {error && (
          <Alert variant="destructive" className="absolute top-20 mx-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasPermission ? (
          <div className="relative w-full max-w-sm aspect-square">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="rounded-lg w-full h-full object-cover"
            />
            {/* Scanning animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border-2 border-primary rounded-lg">
                <div className="animate-scan w-full h-0.5 bg-primary/50" />
              </div>
              {/* Add loading overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              )}
            </div>
            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              {isFlashlightSupported && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full translate-y-2"
                  onClick={toggleFlashlight}
                >
                  {isFlashlightOn ? (
                    <FlashlightOff className="h-5 w-5" />
                  ) : (
                    <Flashlight className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button
                variant="secondary"
                className="rounded-full px-6 translate-y-2"
                onClick={handleCancelScan}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <Camera className="mx-auto mb-4 text-primary" size={48} />
            <h2 className="text-xl font-semibold mb-4">
              Camera Access Required
            </h2>
            <p className="mb-6 text-muted-foreground">
              We need access to your camera to scan QR codes.
            </p>
            <Button
              onClick={requestCameraPermission}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Requesting Access..." : "Allow Camera Access"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileQRScanner;
