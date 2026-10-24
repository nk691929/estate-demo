export type IconKey = "verified" | "local" | "chat" | "support";

export const whyChooseUs: { icon: IconKey; title: string; text: string }[] = [
  {
    icon: "verified",
    title: "Verified listings",
    text: "Every property is checked before it goes online, with clear prices and real photos.",
  },
  {
    icon: "local",
    title: "Local knowledge",
    text: "We know the neighbourhoods, the streets and the fair prices, so you do not have to guess.",
  },
  {
    icon: "chat",
    title: "Quick replies",
    text: "Message us on WhatsApp or send an inquiry and hear back the same day.",
  },
  {
    icon: "support",
    title: "Help to the end",
    text: "From the first viewing to the final paperwork, we stay with you.",
  },
];

export const testimonialsAreSamples = true;

export const testimonials: { name: string; place: string; text: string }[] = [
  {
    name: "Ayesha R.",
    place: "Bought in DHA Phase 6",
    text: "They listened to my budget and only showed homes that really fit. We found our house in two weeks.",
  },
  {
    name: "Usman K.",
    place: "Rented in Johar Town",
    text: "Clear communication from the first message. The viewing was arranged the next day.",
  },
  {
    name: "Sana M.",
    place: "Sold a plot in Bahria Town",
    text: "Honest advice on the price and a smooth process. I always knew what the next step was.",
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "How do I arrange a viewing?",
    answer:
      "Send an inquiry from any property page or message us on WhatsApp. We will confirm a time that suits you.",
  },
  {
    question: "Are the listed prices negotiable?",
    answer:
      "It depends on the owner. Tell us your budget and we will advise you honestly on what is realistic.",
  },
  {
    question: "Can you help with the paperwork?",
    answer:
      "Yes. We guide you through the documents and the transfer process until the deal is complete.",
  },
  {
    question: "I want to sell or rent out my property. Can you list it?",
    answer:
      "Yes. Contact us with the details and photos, and we will talk through how we can help.",
  },
  {
    question: "Which areas do you cover?",
    answer:
      "We work across Lahore, with a focus on the areas shown in our listings.",
  },
];