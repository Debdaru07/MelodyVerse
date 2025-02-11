const serializedResult = (value:any) =>
    JSON.parse(
      JSON.stringify(value, (_, v) => {
        if (typeof v === "bigint") {
          return v.toString();
        }
        if (v === undefined) {
          return null;
        }
        return v;
      })
    );
  
  export default serializedResult;
  