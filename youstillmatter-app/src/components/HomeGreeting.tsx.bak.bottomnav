export default function HomeGreeting() {
  const hour = new Date().getHours();
  let greeting = "You matter.";
  if (hour < 12) greeting = "Good morning. You matter.";
  else if (hour < 18) greeting = "Good afternoon. You matter.";
  else greeting = "Good evening. You matter.";
  return (
    <span className="text-2xl font-semibold text-sky-500">{greeting}</span>
  );
}
