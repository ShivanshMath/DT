import BestRecommenderResult from "./recommender-best-result-card";

const OutputSection = ({ result }) => {
  return (
    <>
      {result.BestMaxRevenue && (
        <BestRecommenderResult
          title={"Best Max Revenue "}
          data={result.BestMaxRevenue}
        />
      )}
      <br />
      {result.SecondBestMaxRevenue && (
        <BestRecommenderResult
          title={"Second Best Max Revenue "}
          data={result.SecondBestMaxRevenue}
        />
      )}
      <br />
      {result.SecondBestMaxRevenue && (
        <BestRecommenderResult
          title={"Third Best Max Revenue"}
          data={result.SecondBestMaxRevenue}
        />
      )}
    </>
  );
};

export default OutputSection;
