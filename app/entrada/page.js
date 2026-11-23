import LoginForm from "@/components/LoginForm";
import PageMain from "@/components/PageMain";
import WaveForm from "@/components/WaveForm";

export default function Home() {
  return (
    <PageMain className="items-center py-12">
      <WaveForm
        type={1}
        className={"w-75 fill-(--colorB3) absolute left-0 top-0 rotate-z-180"}
      />
      <WaveForm className={"w-200 fill-(--colorA3) absolute left-0 bottom-0"} />
      <WaveForm
        type={1}
        className={"fill-(--colorB3) w-100 absolute right-0 top-0 rotate-x-180"}
      />

      <LoginForm />
    </PageMain>
  );
}
