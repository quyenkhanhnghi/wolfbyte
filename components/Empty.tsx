import Image from "next/image";

interface EmptyProps {
  label: string;
}

export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQotlidoP3uGN71_C2cV6s2lt0RymtIg83CLg&usqp=CAU"
          alt="Empty"
          width={300}
          height={300}
        />
      </div>
      <p className="text-muted-foreground text-sm text-center">{label}</p>
    </div>
  );
};
