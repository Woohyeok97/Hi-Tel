import { useContext } from "react"
import AuthContext from "context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { searchQueryState } from "atom";
// components
import PostItem from "components/post/PostItem";
import { PageTop } from "components/shared/PageTop";
import { Input } from "components/shared/Input";
import { Spacing } from "components/shared/Spacing";
import { Text } from "components/shared/Text";
import { Flex } from "components/shared/Flex";
import Loader from "components/shared/Loader";
import { Divider } from "components/shared/Divider";
import { fetchPostsBySearch } from "remotes/postAPI";
// hooks
import useTranslation from "hooks/useTranslation";


export default function SearchPage() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const { translation } = useTranslation();

  const { data: searchPosts, isFetching } = useQuery({
    queryKey: [`postList`, searchQuery],
    queryFn: () => fetchPostsBySearch(searchQuery),
    enabled: !!searchQuery,
    staleTime: 30000,
  });
  
  // 검색쿼리 핸들러
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e?.target;
    setSearchQuery(value?.trim())
  };

  return (
    <>
      <PageTop>
        {translation('MENU_SEARCH')}
      </PageTop>
      <Input
        onChange={handleQueryChange}
        value={searchQuery}
        placeholder={user?.uid ? "검색어를 입력하십시오." : "접속이후 이용해주십시오."}
        disabled={!user?.uid}
      />
      <Spacing size={36} />
      <Text>{translation('POST')}</Text>
      <Spacing size={12} />
      <Divider />
      <Spacing size={12} />
      {isFetching && searchQuery ? (
        <Flex justify="center" align="center">
          <Loader />
        </Flex>
      ) : (
        <Flex direction="column">
          <Spacing size={24} />
          {searchPosts?.map(item => <PostItem key={item?.id} post={item} />)}
        </Flex>
      )}
    </>
  );
}