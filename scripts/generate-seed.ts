import { mkdirSync, writeFileSync } from "node:fs";

import { mockAgents } from "../features/agents/data/mock-agents";
import { mockProperties } from "../features/properties/data/mock-properties";

const q = (value: string) => `'${value.replace(/'/g, "''")}'`;
const list = (values: string[]) => `ARRAY[${values.map(q).join(", ")}]::text[]`;
const maybe = (value: number | undefined) =>
  value === undefined ? "NULL" : String(value);

const agentRows = mockAgents.map(
  (a) =>
    `(${[
      q(a.id),
      q(a.name),
      q(a.role),
      q(a.bio),
      q(a.phone),
      q(a.whatsapp),
      q(a.email),
      q(a.photo),
      a.experienceYears,
    ].join(", ")})`
);

const propertyRows = mockProperties.map(
  (p) =>
    `(${[
      q(p.id),
      q(p.slug),
      q(p.title),
      q(p.description),
      p.price,
      q(p.purpose),
      q(p.type),
      q(p.city),
      q(p.area),
      q(p.address),
      maybe(p.bedrooms),
      maybe(p.bathrooms),
      p.size,
      q(p.sizeUnit),
      list(p.images),
      list(p.features),
      p.featured,
      q(p.agentId),
      p.latitude,
      p.longitude,
    ].join(", ")})`
);

const sql = `insert into public.agents
  (id, name, role, bio, phone, whatsapp, email, photo, experience_years)
values
${agentRows.join(",\n")};

insert into public.properties
  (id, slug, title, description, price, purpose, type, city, area, address,
   bedrooms, bathrooms, size, size_unit, images, features, featured,
   agent_id, latitude, longitude)
values
${propertyRows.join(",\n")};
`;

mkdirSync("supabase", { recursive: true });
writeFileSync("supabase/seed.sql", sql, "utf8");
console.log(`Wrote supabase/seed.sql with ${mockAgents.length} agents and ${mockProperties.length} properties`);