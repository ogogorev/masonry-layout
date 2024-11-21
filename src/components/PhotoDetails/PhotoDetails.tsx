import { useParams } from "react-router-dom";

export const PhotoDetails = () => {
  const { photoId } = useParams();

  return <div>photo details page {photoId} </div>;
};
