import type { ComponentType, ReactNode } from 'react';
import { CalendarDays, Church, Clock, Cross, Heart, MapPin, Sparkles } from 'lucide-react';

type DetailItemProps = {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  children: ReactNode;
};

type LocationActionProps = {
  href: string;
  children: ReactNode;
};

const churchMapUrl = 'https://www.google.com/maps/search/?api=1&query=Our%20Lady%20of%20Salvation%20Church%20Dadar';
const receptionMapUrl = 'https://www.google.com/maps/search/?api=1&query=Emerald%20Hall%20Dr.%20Antonio%20Da%20Silva%20High%20School%20Dadar%20West';

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 text-antique-gold" aria-hidden="true">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-antique-gold/80" />
      <Sparkles className="h-4 w-4" strokeWidth={1.5} />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-antique-gold/80" />
    </div>
  );
}

function DetailItem({ icon: Icon, label, children }: DetailItemProps) {
  return (
    <section className="rounded-[1.35rem] border border-antique-gold/25 bg-white/45 px-4 py-4 shadow-[0_14px_35px_rgba(87,62,27,0.08)] backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-deep-gold">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
        <span>{label}</span>
      </div>
      <div className="text-center font-serif text-[1.45rem] leading-tight text-ink sm:text-[1.65rem]">{children}</div>
    </section>
  );
}

function LocationAction({ href, children }: LocationActionProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-antique-gold/55 bg-porcelain/80 px-5 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-deep-gold shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
    >
      {children}
    </a>
  );
}

function ConfirmAttendanceButton() {
  return (
    <button
      type="button"
      className="min-h-14 w-full rounded-full bg-ink px-6 text-[0.78rem] font-bold uppercase tracking-[0.24em] text-ivory shadow-[0_18px_38px_rgba(47,38,29,0.24)] transition hover:-translate-y-0.5 hover:bg-[#211913] focus:outline-none focus:ring-2 focus:ring-antique-gold/70 focus:ring-offset-4 focus:ring-offset-ivory"
    >
      Confirm Attendance
    </button>
  );
}

export function InvitationScreen() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8">
      <article className="mx-auto max-w-[430px] rounded-[2.2rem] border border-antique-gold bg-ivory p-2 shadow-[0_28px_80px_rgba(76,54,24,0.22)]">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-antique-gold/45 bg-[linear-gradient(180deg,#fffdf7_0%,#fbf6ea_45%,#f6eddc_100%)] px-5 py-7 text-center sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute inset-3 rounded-[1.4rem] border border-antique-gold/25" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-antique-gold/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-antique-gold/50 bg-white/55 text-deep-gold shadow-sm">
              <Cross className="h-6 w-6" strokeWidth={1.4} />
            </div>

            <p className="text-[0.68rem] font-bold uppercase tracking-[0.35em] text-muted-ink">With joyful hearts</p>
            <h1 className="mt-4 font-serif text-[3.2rem] leading-[0.9] tracking-[-0.04em] text-ink sm:text-6xl">
              Baby Boy
            </h1>
            <p className="mt-4 font-serif text-2xl italic text-deep-gold">Baptism</p>

            <Ornament />

            <p className="mx-auto mt-5 max-w-[18rem] text-sm leading-6 text-muted-ink">
              Bernraf Dias and Charlotte Fernandes invite you to celebrate the Holy Baptism of their beloved son.
            </p>

            <div className="my-7 grid gap-3">
              <DetailItem icon={CalendarDays} label="Sunday">
                <span>16 August 2026</span>
              </DetailItem>
              <DetailItem icon={Clock} label="Time">
                <span>10:30 AM</span>
              </DetailItem>
            </div>

            <section className="rounded-[1.6rem] border border-antique-gold/35 bg-white/50 p-5 shadow-[0_18px_45px_rgba(87,62,27,0.09)]">
              <div className="flex items-center justify-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-deep-gold">
                <Church className="h-4 w-4" strokeWidth={1.5} />
                Ceremony
              </div>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-ink">Our Lady of Salvation Church</h2>
              <p className="mt-1 text-sm tracking-[0.12em] text-muted-ink">Dadar</p>
            </section>

            <div className="my-5 flex items-center justify-center text-antique-gold/80">
              <Heart className="h-5 w-5 fill-current" strokeWidth={1.2} />
            </div>

            <section className="rounded-[1.6rem] border border-antique-gold/35 bg-white/50 p-5 shadow-[0_18px_45px_rgba(87,62,27,0.09)]">
              <div className="flex items-center justify-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-deep-gold">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                Reception
              </div>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-ink">Emerald Hall</h2>
              <p className="mt-2 text-sm leading-6 text-muted-ink">Dr. Antonio Da Silva High School<br />Dadar West</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-deep-gold/80">
                Immediately following the Baptism Ceremony
              </p>
            </section>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <LocationAction href={churchMapUrl}>View Church</LocationAction>
              <LocationAction href={receptionMapUrl}>View Reception</LocationAction>
            </div>

            <blockquote className="my-7 rounded-[1.5rem] bg-antique-gold/10 px-5 py-5 font-serif text-xl italic leading-7 text-ink">
              “Children are a heritage from the Lord.”
              <cite className="mt-3 block font-sans text-[0.67rem] not-italic uppercase tracking-[0.26em] text-deep-gold">
                Psalm 127:3
              </cite>
            </blockquote>

            <ConfirmAttendanceButton />
          </div>
        </div>
      </article>
    </main>
  );
}
