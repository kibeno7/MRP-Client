"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { errornotify, successnotify } from "@/lib/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  Briefcase,
  Layers,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

// --- Schema & Options ---
const roundTypeOptions = [
  { label: "Online Assessment", value: "oa" },
  { label: "Group Discussion", value: "gd" },
  { label: "Technical", value: "technical" },
  { label: "System Design", value: "sys-design" },
  { label: "HR", value: "hr" },
] as const;

const questionSchema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must be at least 10 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  description: z
    .string()
    .min(1, { message: "Description must not be empty" })
    .max(300, { message: "Description must be at most 300 characters" }),
  link: z
    .string()
    .url({ message: "Invalid URL format" })
    .optional()
    .or(z.literal("")),
});

const roundSchema = z.object({
  name: z
    .string()
    .min(2, "Round name must be at least 2 characters")
    .max(30, "Round name must be at most 30 characters"),
  type: z.enum(["oa", "gd", "technical", "sys-design", "hr"]),
  date: z.number(),
  note: z.string().max(512, "Note can be of at most 512 characters").optional(),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

const formSchema = z.object({
  company: z
    .string()
    .min(4, "Company name must be at least 4 characters")
    .max(35, "Company name must be at most 35 characters"),
  rounds: z.array(roundSchema).min(1, "At least one round is required"),
  status: z.enum(["ongoing", "placed", "not-placed"]),
  offer: z.enum(["fte", "intern"]),
  compensation: z.number().min(1, "Compensation is required"),
  isSubmitted: z.boolean().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;
type Step = 1 | 2 | 3;

// --- Main Component ---
export default function InterviewForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [expandedRounds, setExpandedRounds] = useState([0]);
  const [expandedQuestions, setExpandedQuestions] = useState<{
    [key: number]: number[];
  }>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitLoadingDraft, setSubmitLoadingDraft] = useState(false);
  const [submitLoadingSubmit, setSubmitLoadingSubmit] = useState(false);
  const router = useRouter();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      rounds: [
        {
          name: "",
          type: "oa" as const,
          date: Date.now(),
          note: "",
          questions: [{ title: "", description: "", link: undefined }],
        },
      ],
      status: "ongoing",
      offer: "fte",
      compensation: undefined,
    },
    mode: "onChange",
  });

  const {
    fields: roundFields,
    append: appendRound,
    remove: removeRound,
  } = useFieldArray({
    control: form.control,
    name: "rounds",
  });

  // Local Storage Logic
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("formData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Submission Handler
  const onSubmitFormHandler = async (
    data: FormSchemaType,
    buttonName: string
  ) => {
    setSubmitLoading(true);
    if (buttonName === "Draft") setSubmitLoadingDraft(true);
    if (buttonName === "Submit") setSubmitLoadingSubmit(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("API URL is not defined");

      data.rounds.forEach((round) =>
        round.questions.forEach((question) => {
          if (question.link === "") question.link = undefined;
        })
      );

      const response = await axios.post(`${apiUrl}/api/v1/interview`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        successnotify("Interview Added Successfully");
        localStorage.removeItem("formData");
        router.push("/dashboard");
      } else {
        throw new Error(response.data.message || "Failed to add the interview");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      errornotify(msg);
    } finally {
      setSubmitLoading(false);
      setSubmitLoadingDraft(false);
      setSubmitLoadingSubmit(false);
    }
  };

  // Helper Functions
  const toggleRound = (index: number) => {
    setExpandedRounds((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleQuestions = (roundIndex: number, questionIndex: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [roundIndex]: prev[roundIndex]?.includes(questionIndex)
        ? prev[roundIndex].filter((i) => i !== questionIndex)
        : [...(prev[roundIndex] || []), questionIndex],
    }));
  };

  const hasErrorsInCurrentStep = (step: Step): boolean => {
    const stepFields: Record<Step, (keyof FormSchemaType)[]> = {
      1: ["company"],
      2: ["rounds"],
      3: ["status", "offer", "compensation"],
    };

    if (step === 2) {
      const rounds = form.getValues("rounds");
      return rounds.some(
        (round, i) =>
          !!form.formState.errors.rounds?.[i]?.name ||
          !!form.formState.errors.rounds?.[i]?.type ||
          !round.questions.length ||
          round.questions.some(
            (_, j) =>
              !!form.formState.errors.rounds?.[i]?.questions?.[j]?.title ||
              !!form.formState.errors.rounds?.[i]?.questions?.[j]?.description
          )
      );
    }
    return stepFields[step].some((field) => !!form.formState.errors[field]);
  };

  // Steps Configuration
  const steps = [
    { id: 1, title: "Company", icon: Briefcase },
    { id: 2, title: "Experience", icon: Layers },
    { id: 3, title: "Outcome", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* --- Header & Stepper --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6 text-center">
            Share Your Experience
          </h1>

          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 -z-10" />
            {steps.map((step) => {
              const isActive = currentStep >= step.id;
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center bg-zinc-50 dark:bg-black px-4"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive
                        ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-black"
                        : "bg-white border-zinc-300 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-700"
                    }`}
                  >
                    <step.icon size={18} />
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Form Container --- */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 md:p-8">
          <Form {...form}>
            <form className="space-y-8">
              <AnimatePresence mode="wait">
                {/* STEP 1: COMPANY */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold">
                        Which company did you interview for?
                      </h2>
                      <p className="text-sm text-zinc-500">
                        Enter the official name of the organization.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. Google, Microsoft, Amazon"
                              className="text-lg h-14"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* STEP 2: ROUNDS */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-semibold">
                        Interview Rounds
                      </h2>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          appendRound({
                            name: "",
                            type: "oa",
                            date: Date.now(),
                            note: "",
                            questions: [
                              { title: "", description: "", link: undefined },
                            ],
                          });
                          setExpandedRounds((prev) => [
                            ...prev,
                            roundFields.length,
                          ]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Round
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {roundFields.map((round, roundIndex) => (
                        <div
                          key={round.id}
                          className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden"
                        >
                          {/* Round Header */}
                          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 flex justify-between items-center">
                            <h3 className="font-medium">
                              Round {roundIndex + 1}
                            </h3>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleRound(roundIndex)}
                              >
                                {expandedRounds.includes(roundIndex) ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </Button>
                              {roundFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => removeRound(roundIndex)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Round Body */}
                          {expandedRounds.includes(roundIndex) && (
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`rounds.${roundIndex}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Round Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="e.g. Coding Round 1"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`rounds.${roundIndex}.type`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Type</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {roundTypeOptions.map((opt) => (
                                            <SelectItem
                                              key={opt.value}
                                              value={opt.value}
                                            >
                                              {opt.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`rounds.${roundIndex}.date`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Date</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="date"
                                          value={
                                            field.value
                                              ? new Date(field.value)
                                                  .toISOString()
                                                  .split("T")[0]
                                              : ""
                                          }
                                          onChange={(e) =>
                                            field.onChange(
                                              new Date(e.target.value).getTime()
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name={`rounds.${roundIndex}.note`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Any specific details about the environment, difficulty, etc."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Questions Section */}
                              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="space-y-4">
                                  {(
                                    form.watch(
                                      `rounds.${roundIndex}.questions`
                                    ) || []
                                  ).map((_, qIndex) => (
                                    <div
                                      key={qIndex}
                                      className="bg-zinc-50 dark:bg-zinc-900/50 rounded-md p-4 border border-zinc-100 dark:border-zinc-800"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                          Question {qIndex + 1}
                                        </h4>
                                        <div className="flex gap-2">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() =>
                                              toggleQuestions(
                                                roundIndex,
                                                qIndex
                                              )
                                            }
                                          >
                                            {expandedQuestions[
                                              roundIndex
                                            ]?.includes(qIndex) ? (
                                              <ChevronUp size={14} />
                                            ) : (
                                              <ChevronDown size={14} />
                                            )}
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-red-500"
                                            onClick={() => {
                                              const qs =
                                                form.getValues(
                                                  `rounds.${roundIndex}.questions`
                                                ) || [];
                                              form.setValue(
                                                `rounds.${roundIndex}.questions`,
                                                qs.filter(
                                                  (_, i) => i !== qIndex
                                                )
                                              );
                                            }}
                                          >
                                            <Trash2 size={14} />
                                          </Button>
                                        </div>
                                      </div>

                                      {expandedQuestions[roundIndex]?.includes(
                                        qIndex
                                      ) && (
                                        <div className="space-y-3">
                                          <FormField
                                            control={form.control}
                                            name={`rounds.${roundIndex}.questions.${qIndex}.title`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="text-xs">
                                                  Question Title
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    placeholder="e.g. Reverse Linked List"
                                                    className="bg-white dark:bg-black"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={form.control}
                                            name={`rounds.${roundIndex}.questions.${qIndex}.description`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="text-xs">
                                                  Description
                                                </FormLabel>
                                                <FormControl>
                                                  <Textarea
                                                    placeholder="Explain the problem statement..."
                                                    className="bg-white dark:bg-black"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={form.control}
                                            name={`rounds.${roundIndex}.questions.${qIndex}.link`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="text-xs">
                                                  Link (LeetCode/GFG)
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    placeholder="https://..."
                                                    className="bg-white dark:bg-black"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-zinc-600 dark:text-zinc-400"
                                    onClick={() => {
                                      const qs =
                                        form.getValues(
                                          `rounds.${roundIndex}.questions`
                                        ) || [];
                                      form.setValue(
                                        `rounds.${roundIndex}.questions`,
                                        [
                                          ...qs,
                                          {
                                            title: "",
                                            description: "",
                                            link: undefined,
                                          },
                                        ]
                                      );
                                      setExpandedQuestions((prev) => ({
                                        ...prev,
                                        [roundIndex]: [
                                          ...(prev[roundIndex] || []),
                                          qs.length,
                                        ],
                                      }));
                                    }}
                                  >
                                    <Plus className="h-3 w-3 mr-2" /> Add
                                    Question
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: OUTCOME */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold">Final Verdict</h2>
                      <p className="text-sm text-zinc-500">How did it go?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ongoing">
                                  On Going
                                </SelectItem>
                                <SelectItem value="placed">Placed</SelectItem>
                                <SelectItem value="not-placed">
                                  Not Placed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="offer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Offer Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Offer" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fte">
                                  Full Time (FTE)
                                </SelectItem>
                                <SelectItem value="intern">
                                  Internship
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="compensation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compensation (CTC in LPA)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 12"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentStep === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep((prev) => (prev - 1) as Step);
                  }}
                >
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black"
                    disabled={hasErrorsInCurrentStep(currentStep)}
                    onClick={async (e) => {
                      e.preventDefault();
                      let fields: (keyof FormSchemaType)[] = [];
                      if (currentStep === 1) fields = ["company"];
                      else if (currentStep === 2) fields = ["rounds"];

                      const valid = await form.trigger(fields);
                      if (valid && !hasErrorsInCurrentStep(currentStep)) {
                        setCurrentStep((prev) => (prev + 1) as Step);
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      disabled={submitLoading}
                      onClick={form.handleSubmit((data) =>
                        onSubmitFormHandler(data, "Draft")
                      )}
                    >
                      {submitLoadingDraft ? (
                        <Loader2 className="mr-2 animate-spin h-4 w-4" />
                      ) : (
                        "Save Draft"
                      )}
                    </Button>
                    <Button
                      className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black"
                      disabled={submitLoading || hasErrorsInCurrentStep(3)}
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            "Submit your experience? You cannot edit this later."
                          )
                        ) {
                          form.setValue("isSubmitted", true);
                          form.handleSubmit((data) =>
                            onSubmitFormHandler(data, "Submit")
                          )();
                        }
                      }}
                    >
                      {submitLoadingSubmit ? (
                        <Loader2 className="mr-2 animate-spin h-4 w-4" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
