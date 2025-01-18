import {
  pgTable,
  integer,
  varchar,
  date,
  timestamp,
  text,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Machines table
export const machines = pgTable("machines", {
  id: serial("id").primaryKey(),
  machineid: varchar("machineid", { length: 50 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  arrived_date: date("arrived_date").notNull(),
  location1: varchar("location1", { length: 100 }).notNull(),
  location2: varchar("location2", { length: 100 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Spareparts table
export const spareparts = pgTable("spareparts", {
  id: serial("id").primaryKey(),
  sparepart_id: varchar("sparepart_id", { length: 50 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  arrived_date: date("arrived_date").notNull(),
  qty: integer("qty").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  machineid: integer("machineid")
    .notNull()
    .references(() => machines.id, { onDelete: "cascade" }),
  sparepartid: integer("sparepartid").references(() => spareparts.id, {
    onDelete: "set null",
  }),
  employid: integer("employid").notNull(),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Relations
export const machinesRelations = relations(machines, ({ many }) => ({
  services: many(services),
}));

export const sparepartsRelations = relations(spareparts, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  machine: one(machines, {
    fields: [services.machineid],
    references: [machines.id],
  }),
  sparepart: one(spareparts, {
    fields: [services.sparepartid],
    references: [spareparts.id],
  }),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerk_id: text("clerk_id").notNull().unique(),
  full_name: text("full_name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
