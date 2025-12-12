"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LuUser,
  LuMail,
  LuMessageSquare,
  LuSend,
  LuLoader,
} from "react-icons/lu";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(values);
    setIsSubmitting(false);
    setIsSuccess(true);
    form.reset();
    setTimeout(() => setIsSuccess(false), 4000);
  }

  return (
    <section
      id="contact"
      className="py-24 bg-white dark:bg-black flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg px-4"
      >
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg bg-white dark:bg-zinc-950">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Get in Touch
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-base">
              Have a question or want to work together? Drop us a message.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <LuUser className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 transition-colors" />
                          <Input
                            placeholder="Your Name"
                            className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <LuMail className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 transition-colors" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Message
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <LuMessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 transition-colors" />
                          <Textarea
                            placeholder="How can we help you?"
                            className="pl-10 min-h-[140px] resize-y bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 text-base bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all duration-200 shadow-sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <LuLoader className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <LuSend className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center justify-center p-3 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/10 dark:text-green-400 rounded-md"
                  >
                    Thanks! We've received your message.
                  </motion.div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default ContactForm;
