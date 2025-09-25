export default function SafetyBanner(){
  return (
    <div className="rounded-xl border border-[color:var(--color-primary)] bg-[color:var(--surface-light)] p-3 text-sm dark:bg-[color:var(--surface-dark)]">
      <strong>If you’re in immediate danger, call 911.</strong> In the U.S., call <a className="underline" href="tel:988">988</a> or text <strong>HOME</strong> to <a className="underline" href="sms:741741?&body=HOME">741741</a>.
    </div>
  );
}
