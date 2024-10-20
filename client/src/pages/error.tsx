import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <main className="flex min-h-svh items-center justify-center">
      <Card className="mx-4 max-w-screen-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-medium text-muted-foreground md:text-xl">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="border-t pt-6">
          <CardDescription className="bg-destructive/15 px-2 py-4">
            <p className="text-balance text-center font-medium text-destructive">
              {error?.message || "An unexpected error occurred"}
            </p>
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="mx-auto text-xs font-semibold md:text-sm"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
