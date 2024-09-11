
export default function CartItems() {
  return (
    <section className='border flex gap-[1rem] p-[1.5rem]'>
      <input type="checkbox" defaultChecked className="checkbox self-start" />
      <article className='flex justify-between'>
        <div className='w-[23%]'>
          <img src="/stak-logo2.png" alt="cart-item" />
        </div>
        <div className='flex flex-col'>
          <p className='text-[1.6rem] font-semibold leading-none'>Apple Watch Ultra 2 with Ocean Band</p>
          <p className='text-[2rem] font-bold'>IDR 15.999.000</p>

        </div>
      </article>
    </section>
  )
}
