import GuideImg from "../../assets/guidImg.png";

export const GuideSection = () => {
  return (
    <section className="w-full px-6 py-10 bg-gray-50 mb-10">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
       
        {/* Image */}
        <div className="flex-1 flex justify-center ">
          <img
            src={GuideImg}
            alt="Guide"
            className="w-full max-w-xxl rounded-2xl object-cover shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};
