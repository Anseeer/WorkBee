import GuideImg from "../../assets/guidImg.png";

export const GuideSection = () => {
  return (
    <section className="w-full px-6 py-10 bg-gray-50 mb-10">
      <div
        className="bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 opacity-0 animate-fadeInUp group hover:-translate-y-2"
      >

        {/* Image */}
        <div className="flex-1 flex justify-center ">
          <img
            src={GuideImg}
            alt="Guide"
            className="max-w-5xl w-full rounded-2xl  object-cover shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};
