import React from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { Link } from "react-router-dom";

type TopNavigationProps = {
  title: string;
  icon?: React.ReactNode;
};

export default function TopNavigation({ title, icon }: TopNavigationProps) {
  return (
    <section className="flex items-center justify-between">
      <div className="border border-[#ebedf3] rounded-full text-center p-[.6rem]">
        <Link to="/">
          <BsArrowLeftShort className="text-[2.5rem]" />
        </Link>
      </div>
      <h2 className="text-[2rem] font-bold">{title}</h2>
      <article className={icon ? "visible" : "invisible"}>
        {icon && (
          <div className="border border-[#ebedf3] rounded-full text-center p-[.8rem]">
            {icon}
          </div>
        )}
      </article>
    </section>
  );
}
