const Info = ({ title, value, unit }) => {
  return (
    <article className='grid grid-cols-2 md:grid-cols-1 gap-2'>
      <h3 className='text-xs md:text-sm text-black text-opacity-50'>{title}</h3>
      <p className='md:text-2xl lg:text-4xl xl:text-5xl font-semibold justify-self-end md:justify-self-start'>
        {value}{" "}
        <span className='text-xs md:text-base lg:text-2xl xl:text-3xl'>
          {unit}
        </span>
      </p>
    </article>
  );
};

export default Info;
