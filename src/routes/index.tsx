import { createFileRoute } from "@tanstack/react-router";
import { Desk } from "@/components/pulo/desk";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Desk />;
}
