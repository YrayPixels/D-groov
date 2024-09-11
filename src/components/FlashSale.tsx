export default function FlashSale() {
  return (
    <>
    <section className='relative mt-6 p-9 bg-[url("stak-logo2.png")] bg-cover bg-no-repeat bg-center -z-10'>
      <div className="flex flex-col text-white gap-3">
        <h3 className="font-bold text-[2.5rem]">6.6 Flash Sale</h3>
        <p className="font-semibold text-[2rem]">Cashback up to 100%</p>
        <button className="w-[40%] py-[1rem] rounded-xl text-[1.5rem] font-semibold bg-[#fa5a2a] btn btn-secondary">
          Secondary
        </button>
      </div>
    </section>

      <section className="flex mt-[4rem] items-center justify-between">
        <article className="flex items-center gap-4 basis-[80%]">
        <h3 className="text-[2rem] font-bold">Flash Sale</h3>
        <div className="flex items-center gap-4 basis-[60%]">
          <p className="text-[1.4rem] text-[#d1d3da]">Ends in</p>
          <div className=" bg-red-500 text-white font-semibold py-[1rem] px-[.5rem] rounded-full text-center w-[50%]">12:56:32</div>
        </div>
        </article>
        <h4 className="text-orange-600 text-[1.5rem] font-bold">See them</h4>
      </section>
    </>
  );
}
