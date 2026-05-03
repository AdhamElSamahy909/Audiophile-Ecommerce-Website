import Button from "../ui/Button";
import Image from "next/image";
import Container from "../ui/Container";
import BestAudioGear from "../ui/BestAudioGear";
import CategoryList from "../ui/CategoryList";

function HomePage() {
  return (
    <div className="pt-[12rem] w-full flex flex-col gap-[12rem] lg:gap-[16.8rem] px-[2.4rem] lg:px-[4rem] mb-[12rem] lg:mb-[20rem]">
      <CategoryList />

      <Container>
        <div className="flex flex-col gap-[2.4rem] md:gap-[3.2rem] lg:gap-[4.8rem]">
          <div className="bg-accent text-white rounded-lg flex flex-col lg:flex-row items-center justify-center lg:justify-end py-[5.5rem] md:py-[6.4rem] lg:py-[0] lg:pt-[9.6rem] px-[2.3rem] lg:px-[9.5rem] gap-[3.2rem] md:gap-[6.4rem] lg:gap-[13.8rem] bg-[url('/assets/home/desktop/pattern-circles.svg')] bg-no-repeat bg-[length:170%] md:bg-[length:100%] lg:bg-contain bg-top lg:bg-[-150px_-30px] lg:overflow-hidden relative">
            <div className="w-full flex items-center justify-center lg:justify-start lg:absolute lg:bottom-[-1.5rem] lg:left-[11.7rem] lg:w-auto">
              <Image
                src="/assets/shared/desktop/image-category-thumbnail-speakers.png"
                alt="ZX9 SPEAKER"
                width={173}
                height={207}
                className="w-[172px] md:w-[197px] lg:w-[410px] h-[207px] md:h-[237px] lg:h-[493px]"
              />
            </div>

            <div className="flex flex-col items-center lg:items-start lg:w-[349px] gap-[2.4rem] lg:mb-[12.4rem]">
              <p className="text-[3.6rem] md:text-[5.6rem] font-bold tracking-[0.13rem] md:tracking-[0.2rem] leading-[4rem] md:leading-[5.8rem] uppercase text-center lg:text-left">
                zx9
                <br />
                speaker
              </p>
              <p className="text-[1.5rem] leading-[2.5rem] text-center lg:text-left text-white/75 md:w-[349px]">
                Upgrade to premium speakers that are phenomenally built to
                deliver truly remarkable sound.
              </p>
              <Button variant="secondary1">see product</Button>
            </div>
          </div>

          <div
            className="flex flex-col items-start justify-center w-full min-h-[320px] bg-cover bg-center rounded-lg px-[2.4rem] md:px-[6.2rem] lg:px-[9.5rem]"
            style={{
              backgroundImage:
                "url('/assets/home/desktop/image-speaker-zx7.jpg')",
            }}
          >
            <h2 className="text-black font-bold text-[2.8rem] mb-8 tracking-[0.2rem]">
              ZX7 SPEAKER
            </h2>
            <Button variant="secondary2">see product</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.4rem] md:gap-[1.1rem] lg:gap-[3rem] w-full h-auto">
            <div
              className="w-full min-h-[200px] md:min-h-[320px] bg-cover bg-center rounded-lg"
              style={{
                backgroundImage:
                  "url('/assets/home/desktop/image-earphones-yx1.jpg')",
              }}
            ></div>
            <div className="w-full bg-[#F1F1F1] flex flex-col items-start justify-center rounded-lg py-[4.1rem] md:py-[0] px-[2.4rem] md:px-[4.1rem] lg:px-[9.5rem] md:min-h-[320px]">
              <h2 className="text-black font-bold text-[2.8rem] mb-8 tracking-[0.2rem]">
                YX1 EARPHONES
              </h2>
              <Button variant="secondary2">see product</Button>
            </div>
          </div>
        </div>
      </Container>

      <BestAudioGear />
    </div>
  );
}

export default HomePage;
