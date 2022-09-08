import { describe, expect, test } from "vitest";
import { render } from "solid-testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { LastReleased } from "../../src/components/LastReleased";
import {
  setIsReleased,
  setLastImageUri,
  setLastReleasedAt,
} from "../../src/signal";

describe("<LastReleased />", () => {
  const messageList = [
    {
      title: "タグ形式の URI",
      lastImageUri:
        "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
      lastReleasedAt: new Date(2022, 0, 1, 0, 0),
      lastReleasedAtString: "2022-01-01 00:00",
    },
    {
      title: "ダイジェスト形式の URI",
      lastImageUri:
        "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/fuga@sha256:20b39162cb057eab7168652ab012ae3712f164bf2b4ef09e6541fca4ead3df62",
      lastReleasedAt: new Date(2022, 11, 31, 23, 59),
      lastReleasedAtString: "2022-12-31 23:59",
    },
  ];
  messageList.forEach((testCase) => {
    test(testCase.title, async () => {
      setIsReleased(true);
      setLastImageUri(testCase.lastImageUri);
      setLastReleasedAt(testCase.lastReleasedAt);
      const { container, getByText, unmount } = render(() => <LastReleased />);
      const lastImageUri = (await getByText(
        testCase.lastImageUri
      )) as HTMLElement;
      expect(lastImageUri).toHaveTextContent(testCase.lastImageUri);
      const lastReleasedAtString = (await getByText(
        testCase.lastReleasedAtString
      )) as HTMLElement;
      expect(lastReleasedAtString).toHaveTextContent(
        testCase.lastReleasedAtString
      );
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      unmount();
    });
  });
});
