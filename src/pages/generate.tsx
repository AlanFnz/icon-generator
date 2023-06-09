/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Button from "~/components/Button";

import FormGroup from "~/components/FormGroup";
import Input from "~/components/Input";
import { api } from "~/utils/api";

const GeneratePage: NextPage = () => {
  const [form, setForm] = useState<{ prompt: string }>({
    prompt: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  const session = useSession();
  const isLoggedIn = !!session.data;

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      if (!data.imageUrl) return;
      setImageUrl(data.imageUrl);
    },
  });

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    generateIcon.mutate({
      prompt: form.prompt,
    });
    setForm({ prompt: "" });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <>
      <Head>
        <title>Generate Page</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Button
          onClick={() => {
            isLoggedIn
              ? signOut().catch(console.error)
              : signIn().catch(console.error);
          }}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </Button>
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <FormGroup>
            <label htmlFor="prompt">Prompt</label>
            <Input
              id="prompt"
              name="prompt"
              value={form.prompt}
              onChange={handleInputChange}
            ></Input>
          </FormGroup>
          <Button>Submit</Button>
        </form>

        {imageUrl && <Image src={imageUrl} alt={"generated image"} height={200} width={200}/>}
      </main>
    </>
  );
};

export default GeneratePage;
