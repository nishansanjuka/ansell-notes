import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex w-full h-screen fixed bg-muted justify-center items-center">
      <SignIn />
    </div>
  );
}
