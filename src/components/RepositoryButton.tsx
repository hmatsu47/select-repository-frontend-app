import Button from "@suid/material/Button";
import { fetchImages } from "../api/fetchImages";
import {
  repository,
  service,
  setRepository,
  setRepositoryUri,
} from "../signal";
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
        setRepositoryUri(props.repositoryItem.uri);
        // 選択肢をローカルストレージに（サービス別で）記録しておく
        localStorage.setItem(
          `selectedRepository-${service()}`,
          props.repositoryItem.name
        );
        await fetchImages();
      }}
      sx={{ textTransform: "none" }}
    >
      {props.repositoryItem.name}
    </Button>
  );
};
