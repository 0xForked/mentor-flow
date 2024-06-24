export const MenteePage = () => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  return (
    <>
      <div className="flex justify-center mt-12">
        Hello World Mentee
        <br />
        - Display Mentor List
        <br />
        - Open Booking Page when mentor selected
        <br />
        {timeZone}
      </div>
    </>
  );
};
