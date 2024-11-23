import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container max-w-3xl mx-auto mt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2.5">Welcome to Qollective</h1>
          <p className="text-muted-foreground">
            A collaborative platform for contributing and testing your
            competitive exam questions.
          </p>
        </div>

        <Card>
          <CardContent>
            <div className="grid gap-4">
              <div className="col-span-3 py-5">
                <h2 className="text-2xl font-bold mb-2">About Qollective</h2>
                <p className="text-muted-foreground">
                  Qollective is a community-driven platform where you can ask
                  questions, share knowledge, and learn from others. Whether
                  you&apos;re a student, a professional, or simply curious about
                  a topic, Qollective provides a space for you to engage with
                  like-minded individuals and expand your understanding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link href="/qbanks">Search For Questions</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
