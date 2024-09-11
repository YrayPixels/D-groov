import { useEffect, useState } from "react";
import { fetchMagicEdenCollections } from "../requestsHandler/requestsItems";

export default function Categories() {

  const [collections, setCollections] = useState<any>([])
  useEffect(() => {
    (async () => {
      const response = await fetchMagicEdenCollections();
      setCollections(response.data.slice(0, 8));
    })()

  }, [])
  return (
    <>
      <div>
        <p className="font-bold">Collections</p>
      </div>
      <section className="grid grid-cols-4 gap-5 mt-7 border-red-950">

        {collections.length > 0 && collections.map((item: any, index: number) => {
          return (
            <article key={index} className="flex flex-col items-center gap-4">
              <div className="w-[6.5rem] overflow-hidden flex justify-center items-center border border-[#e1e4ed] rounded-full h-[6.5rem]  ">
                <img src={item.image} alt="category-images" />
              </div>
              <p className="text-center">{item.name}</p>
            </article>
          )
        })
        }
      </section>
    </>

  );
}
