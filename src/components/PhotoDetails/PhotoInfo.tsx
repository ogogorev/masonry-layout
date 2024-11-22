import { FC } from "react";
import { styled } from "@linaria/react";

import { PhotoData } from "../../api/pexels/types";
import { Title } from "../ui/Title";
import { Text } from "../ui/Text";

const Wrapper = styled.div`
  text-align: center;
`;

type PhotoInfoProps = {
  photoData: PhotoData;
};

export const PhotoInfo: FC<PhotoInfoProps> = ({ photoData }) => {
  const { alt, photographer, photographer_url } = photoData;

  const date = new Date(
    Math.floor(Math.random() * Date.now())
  ).toLocaleDateString();

  return (
    <Wrapper>
      <Title>{alt || "No title"}</Title>

      <Text>
        Author:{" "}
        <a href={photographer_url} target="_blank">
          {photographer}
        </a>
      </Text>

      <Text>Date (random): {date}</Text>
    </Wrapper>
  );
};
