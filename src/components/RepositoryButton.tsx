import Button from "@suid/material/Button";
import { fetchImages } from "../api/fetchImages";
import { repository, setRepository } from "../signal";
import { RepositoryItem } from "../type";

type Props = {
  repositoryItem: RepositoryItem;
};

export const RepositoryButton = (props: Props) => {
  return (
    <Button
      variant={
        repository() === props.repositoryItem.name ? "contained" : "outlined"
      }
      size="small"
      color={repository() === props.repositoryItem.name ? "primary" : "inherit"}
      onClick={async (e) => {
        setRepository(props.repositoryItem.name);
        await fetchImages();
      }}
      sx={{ textTransform: "none" }}
    >
      {props.repositoryItem.name}
    </Button>
  );
};
