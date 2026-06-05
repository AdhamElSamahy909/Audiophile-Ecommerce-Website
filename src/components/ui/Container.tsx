type ContainerProps = {
  children: React.ReactNode;
  extraClasses?: string;
};

function Container({ children, extraClasses }: ContainerProps) {
  return (
    <div className={`w-full max-w-[1110px] mx-auto px-[2.4rem] md:px-[4rem] xl:px-0 ${extraClasses || ""}`}>
      {children}
    </div>
  );
}

export default Container;
