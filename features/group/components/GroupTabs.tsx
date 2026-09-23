interface Props{
  tab:string;
  setTab:(v:string)=>void;
}

export default function GroupTabs({
  tab,
  setTab,
}:Props){

  const tabs=["proposal","members","about"];

  return(
    <div className="flex gap-6 border-b">
      {tabs.map(item=>(
        <button
          key={item}
          onClick={()=>setTab(item)}
          className={`pb-3 capitalize ${
            tab===item
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}