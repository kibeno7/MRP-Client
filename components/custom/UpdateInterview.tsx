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
import { Interview } from "@/types/Interview";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

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

export default function UpdateInterviewForm({
  interview,
}: {
  interview: Interview;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedRounds, setExpandedRounds] = useState([0]);
  const [expandedQuestions, setExpandedQuestions] = useState<{
    [key: number]: number[];
  }>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();
  console.log(interview);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: interview.company,
      rounds: interview.rounds.map((round) => ({
        name: round.name,
        type: round.type,
        date: round.date,
        note: round.note,
        questions: round.questions.map((question) => ({
          title: question.title,
          description: question.description,
          link: question.link,
        })),
      })),
      status: interview.status,
      offer: interview.offer,
      compensation: interview.compensation,
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

  const onSubmitFormHandler = async (data: FormSchemaType) => {
    console.log("Form submitted with data:", data);
    setSubmitLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined");
      }

      const interviewId = interview._id;
      await axios.delete(`${apiUrl}/api/v1/interview/${interviewId}`, {
        withCredentials: true,
      });

      data.rounds.forEach((round) =>
        round.questions.forEach((question) => {
          if (question.link === "") question.link = undefined;
        })
      );

      const response = await axios.post(`${apiUrl}/api/v1/interview`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        successnotify("Interview Updated Successfully");
        router.push("/dashboard");
      } else {
        throw new Error(
          response.data.message || "Failed to update the interview"
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);

      if (axios.isAxiosError(error)) {
        errornotify(
          `Failed to update the interview: ${error.response?.data?.message || error.message}`
        );
      } else if (error instanceof Error) {
        errornotify(`Error: ${error.message}`);
      } else {
        errornotify("An unexpected error occurred");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

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

  type Step = 1 | 2 | 3;

  const hasErrorsInCurrentStep = (currentStep: Step): boolean => {
    const stepFields: Record<Step, (keyof FormSchemaType)[]> = {
      1: ["company"],
      2: ["rounds"],
      3: ["status", "offer", "compensation"],
    };

    const currentStepFields = stepFields[currentStep];

    if (currentStep === 2) {
      const rounds = form.getValues("rounds");
      return rounds.some(
        (round, i) =>
          !!form.formState.errors.rounds?.[i]?.name ||
          !!form.formState.errors.rounds?.[i]?.type ||
          !!form.formState.errors.rounds?.[i]?.date ||
          !round.questions.length ||
          round.questions.some(
            (_, j) =>
              !!form.formState.errors.rounds?.[i]?.questions?.[j]?.title ||
              !!form.formState.errors.rounds?.[i]?.questions?.[j]
                ?.description ||
              !!form.formState.errors.rounds?.[i]?.questions?.[j]?.link
          )
      );
    }

    return currentStepFields.some((field) => !!form.formState.errors[field]);
  };

  const isNextButtonDisabled = (currentStep: Step): boolean => {
    return hasErrorsInCurrentStep(currentStep);
  };

  return (
    <Form {...form}>
      <form className="space-y-8 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {currentStep === 1 && (
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {currentStep === 2 && (
          <>
            {roundFields.map((round, roundIndex) => (
              <div key={round.id} className="space-y-4 p-4 border rounded">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Round {roundIndex + 1}
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRound(roundIndex)}
                    >
                      {expandedRounds.includes(roundIndex) ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </Button>
                    {roundFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRound(roundIndex)}
                      >
                        <Trash2
                          style={{ color: "#D22B2B" }}
                          className="h-4 w-4"
                        />
                      </Button>
                    )}
                  </div>
                </div>
                {expandedRounds.includes(roundIndex) && (
                  <>
                    <FormField
                      control={form.control}
                      name={`rounds.${roundIndex}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Round Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter round name" {...field} />
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
                          <FormLabel>Round Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select round type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roundTypeOptions.map(({ label, value }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`rounds.${roundIndex}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="Enter date"
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
                              className="shadcn-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`rounds.${roundIndex}.note`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter note (optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4">
                      {(form.watch(`rounds.${roundIndex}.questions`) || []).map(
                        (_, questionIndex) => (
                          <div
                            key={questionIndex}
                            className="space-y-4 p-4 border rounded"
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="text-md font-semibold">
                                Question {questionIndex + 1}
                              </h4>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    toggleQuestions(roundIndex, questionIndex)
                                  }
                                >
                                  {expandedQuestions[roundIndex]?.includes(
                                    questionIndex
                                  ) ? (
                                    <ChevronUp />
                                  ) : (
                                    <ChevronDown />
                                  )}
                                </Button>
                                {form.watch(`rounds.${roundIndex}.questions`)
                                  .length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const questions =
                                        form.getValues(
                                          `rounds.${roundIndex}.questions`
                                        ) || [];
                                      form.setValue(
                                        `rounds.${roundIndex}.questions`,
                                        questions.filter(
                                          (_, i) => i !== questionIndex
                                        )
                                      );
                                    }}
                                  >
                                    <Trash2
                                      style={{ color: "#D22B2B" }}
                                      className="h-4 w-4"
                                    />
                                  </Button>
                                )}
                              </div>
                            </div>

                            {expandedQuestions[roundIndex]?.includes(
                              questionIndex
                            ) && (
                              <>
                                <FormField
                                  control={form.control}
                                  name={`rounds.${roundIndex}.questions.${questionIndex}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Title</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter title"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`rounds.${roundIndex}.questions.${questionIndex}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Enter description"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`rounds.${roundIndex}.questions.${questionIndex}.link`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Link (Optional)</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter link"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </>
                            )}
                          </div>
                        )
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const questions =
                            form.getValues(`rounds.${roundIndex}.questions`) ||
                            [];
                          form.setValue(`rounds.${roundIndex}.questions`, [
                            ...questions,
                            { title: "", description: "", link: undefined },
                          ]);
                          setExpandedQuestions((prev) => ({
                            ...prev,
                            [roundIndex]: [
                              ...(prev[roundIndex] || []),
                              questions.length,
                            ],
                          }));
                        }}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Question
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                appendRound({
                  name: "",
                  type: "oa",
                  date: Date.now(),
                  note: "",
                  questions: [{ title: "", description: "", link: undefined }],
                });
                setExpandedRounds((prev) => [...prev, roundFields.length]);
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Round
            </Button>
          </>
        )}

        {currentStep === 3 && (
          <>
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
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ongoing">On Going</SelectItem>
                      <SelectItem value="placed">Placed</SelectItem>
                      <SelectItem value="not-placed">Not Placed</SelectItem>
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
                  <FormLabel>Offer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select offer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fte">FTE</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compensation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compensation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Compensation"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep((prev) => prev - 1);
              }}
            >
              Previous
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                let fields = ["company"];
                if (currentStep === 2) fields = ["rounds"];
                else if (currentStep === 3)
                  fields = ["status", "offer", "compensation"];
                await form.trigger(
                  fields as (
                    | "company"
                    | "rounds"
                    | "status"
                    | "offer"
                    | "compensation"
                  )[]
                );
                if (!isNextButtonDisabled(currentStep as Step)) {
                  setCurrentStep((prev) => prev + 1);
                } else {
                }
              }}
              disabled={isNextButtonDisabled(currentStep as Step)}
            >
              Next
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                disabled={
                  submitLoading || hasErrorsInCurrentStep(currentStep as Step)
                }
                onClick={form.handleSubmit(onSubmitFormHandler)}
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Submitting...{" "}
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>
              <Button
                disabled={
                  submitLoading || hasErrorsInCurrentStep(currentStep as Step)
                }
                onClick={(e) => {
                  e.preventDefault();
                  const canSubmit = window.confirm(
                    "Once submitted, you will not be able to update you draft. Are you sure to submit?"
                  );
                  if (canSubmit) {
                    form.setValue("isSubmitted", true);
                    form.handleSubmit(onSubmitFormHandler)();
                  }
                }}
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Submitting...{" "}
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
