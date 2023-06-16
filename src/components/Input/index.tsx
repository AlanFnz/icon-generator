const Input = (props: React.ComponentPropsWithoutRef<"input">) => {
  return (
    <input
      {...props}
      type="text"
      className="py-2 rounded border border-gray-800 px-2 dark:text-gray-800"
    ></input>
  );
};

export default Input;
