import Image from 'next/image';

const features = [
  {
    icon: 'icon_microphone',
    title: 'Asesmen Suara AI',
    description: 'Ucapkan jawabanmu, AI langsung menilai pelafalan dan pemahamanmu.',
  },
  {
    icon: 'icon_headphone',
    title: 'Dengarkan & Praktik',
    description: 'Latihan mendengarkan dan berbicara yang interaktif, bukan cuma teori.',
  },
  {
    icon: 'icon_target',
    title: 'Learning Path Personal',
    description: 'Materi menyesuaikan level dan progres belajar masing-masing anak.',
  },
  {
    icon: 'icon_ai',
    title: 'Ditemani AI Setiap Saat',
    description: 'Tanya jawab dan diskusi dengan pendamping AI kapan pun dibutuhkan.',
  },
];

export function LandingFeatures() {
  return (
    <section id="fitur" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight text-[#2f2518] sm:text-4xl">
          Semua yang dibutuhkan untuk belajar bahasa
        </h2>
        <p className="mt-4 text-base leading-7 text-[#75644f] sm:text-lg">
          Dirancang supaya anak-anak betah belajar setiap hari, ditemani AI yang sabar dan
          responsif.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-white/60 bg-[#fff9e9] p-6 shadow-[0_14px_36px_rgba(91,58,24,0.12)]"
          >
            <div className="size-14 overflow-hidden rounded-2xl shadow-[0_10px_24px_rgba(47,106,67,0.2),0_2px_6px_rgba(47,37,24,0.12)]">
              <Image
                src={`/images/${feature.icon}.png`}
                alt=""
                width={1254}
                height={1254}
                className="size-full object-cover"
              />
            </div>
            <h3 className="mt-5 text-lg font-black tracking-tight text-[#2f2518]">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#75644f]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
