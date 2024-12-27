import { Box, HStack, Input, Text, createListCollection } from "@chakra-ui/react"
import { Field } from "~/components/ui/field"
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"
import { json } from '@remix-run/node';

const AddonFinanceInvoiceCreate = () => {
  const enviroment = createListCollection({
    items: ["Development", "Staging", "Production"],
  })
  const platform = createListCollection({
    items: ["AWS", "DigitalOcean", "Google Cloud Platform (GCP)", "Azure", "Vercel"],
  })
  const region = createListCollection({
    items: ["US East", "US West", "Europe East", "Europe West", "Asia Pacific"],
  })
  const cpu = createListCollection({
    items: ["1 Core", "2 Core", "4 Core", "8 Core"],
  })
  const ram = createListCollection({
    items: ["1GB", "2GB", "4GB", "8GB", "16GB", "32GB", "64GB"],
  })
  const storage = createListCollection({
    items: ["10GB", "20GB", "50GB", "100GB", "250GB", "500GB", "1TB", "2TB"]
  })
  const database_type = createListCollection({
    items: ["NoSQL Databases", "MongoDB", "Cassandra", "Redis", "DynamoDB", "Couchbase", "Relational Databases (SQL)", "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Microsoft SQL Server", "Oracle Database", "Graph Databases", "Amazon Neptune", "Neo4j", "Time-Series Databases", "InfluxDB", "TimescaleDB", "Columnar Databases", "Apache Cassandra", "Google Bigtable", "Data Warehousing", "Amazon Redshift", "Snowflake", "Google BigQuery", "Newer/Custom Databases", "CockroachDB", "FaunaDB", "ArangoDB"],
  })

  const database_size = createListCollection({
    items: ["Small", "Medium", "Large"]
  })
  const backup_frequency = createListCollection({
    items: ["Daily", "Weekly", "Monthly"]
  })
  const redundancy = createListCollection({
    items: ["Single Instance", "Multi-AZ Deployment"]
  })
  const ssl_certificate = createListCollection({
    items: ["Let's Encrypt", "Custom Certificate", "None"]
  })
  return (
    <Box overflowY="auto">
      <Text fontSize={"2xl"} fontWeight={"bold"}>Create Invoice</Text>
      <Text fontSize={"xl"} fontWeight={"bold"} mt={4}>Basic Information</Text>
      <Box>
        <HStack mt={2}>
          <Field label="Invoice Number:">
            <Input placeholder="2024-INV-P12345-00001" disabled />
          </Field>
          <Field label="Date">
            <Input placeholder="21-09-2023" disabled />
          </Field>
        </HStack>
        <HStack mt={4} width={"50%"}>
        <Field label="Due Date">
            <Input placeholder="21-09-2023" type="date" />
          </Field>
        </HStack>

        <Text fontSize={"xl"} fontWeight={"bold"} mt={8}>Billing Information</Text>
        <HStack mt={4}>
          <Field label="Name:">
            <Input placeholder="Enter Billing Name" />
          </Field>
          <Field label="Email:">
            <Input placeholder="Enter Billing Email" />
          </Field>
        </HStack>
        <HStack mt={4}>
          <Field label="Phone Number:">
            <Input placeholder="Enter Billing Phone Number" />
          </Field>
          <Field label="Address:">
            <Input placeholder="Enter Billing Address" />
          </Field>
        </HStack>

        <Text fontSize={"xl"} fontWeight={"bold"} mt={8}>Compute Resources</Text>
        <HStack mt={4}>
          <SelectRoot collection={cpu} size="sm" width="50%">
            <SelectLabel>How many CPU cores are required for this instance?</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="CPU" />
            </SelectTrigger>
            <SelectContent>
              {cpu.items.map((cp) => (
                <SelectItem item={cp} key={cp}>
                  {cp}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <SelectRoot collection={ram} size="sm" width="50%">
            <SelectLabel>How much RAM should be allocated?</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="RAM" />
            </SelectTrigger>
            <SelectContent>
              {ram.items.map((cp) => (
                <SelectItem item={cp} key={cp}>
                  {cp}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </HStack>
        <HStack mt={4}>
          <SelectRoot collection={storage} size="sm" width="50%">
            <SelectLabel>How much storage is needed?</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Storage" />
            </SelectTrigger>
            <SelectContent>
              {storage.items.map((st) => (
                <SelectItem item={st} key={st}>
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </HStack>

        <Text fontSize={"xl"} fontWeight={"bold"} mt={8}>Database Configuration</Text>
        <HStack mt={4}>
          <SelectRoot collection={database_type} size="sm" width="50%">
            <SelectLabel>Which database system should be used?</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Database Type" />
            </SelectTrigger>
            <SelectContent>
              {database_type.items.map((dt, index) => (
                <SelectItem item={dt} key={dt}>
                  {[0, 6, 13, 16, 19, 22, 26].includes(index) ? (
                    <Text fontWeight={"bold"}>{dt}</Text>
                  ) : dt}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <SelectRoot collection={database_size} size="sm" width="50%">
            <SelectLabel>What is the expected size of the database?</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Database Size" />
            </SelectTrigger>
            <SelectContent>
              {database_size.items.map((ds) => (
                <SelectItem item={ds} key={ds}>
                  {ds}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </HStack>
        <HStack mt={4}>
          <SelectRoot collection={backup_frequency} size="sm" width="50%">
            <SelectLabel>How often should database backups be taken?</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Backup Frequency" />
            </SelectTrigger>
            <SelectContent>
              {backup_frequency.items.map((bf) => (
                <SelectItem item={bf} key={bf}>
                  {bf}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </HStack>

        <Text fontSize={"xl"} fontWeight={"bold"} mt={8}>Scaling and Redundancy</Text>
        <HStack mt={4}>
          <Field label="Should the instance scale automatically based on traffic?">
            <Switch variant="raised">
              Auto-scaling
            </Switch>
          </Field>
          <Field label="Do you need a load balancer for this instance?">
            <Switch variant="raised">
              Load Balancer
            </Switch>
          </Field>
        </HStack>
        <HStack mt={4}>
          <SelectRoot collection={redundancy} size="sm" width="50%">
            <SelectLabel>Should this deployment have redundancy for high availability?</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Redundancy" />
            </SelectTrigger>
            <SelectContent>
              {redundancy.items.map((rd) => (
                <SelectItem item={rd} key={rd}>
                  {rd}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <SelectRoot collection={ssl_certificate} size="sm" width="50%">
            <SelectLabel>Should the CMS have SSL enabled?</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="SSL Certificate" />
            </SelectTrigger>
            <SelectContent>
              {ssl_certificate.items.map((sc) => (
                <SelectItem item={sc} key={sc}>
                  {sc}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </HStack>
      </Box>
    </Box>
  )
}

export default AddonFinanceInvoiceCreate