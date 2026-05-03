type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  return <div className="w-full max-w-[1110px] mx-auto">{children}</div>;
}

export default Container;
