import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface QueryFetcherProps {
  queryKey: any[];
  queryFn: () => Promise<any>;
  queryOpt: UseQueryOptions;
  renderFn: (data: any) => JSX.Element | null;
}
export default function QueryFetcher({ queryKey, queryFn, queryOpt, renderFn }: QueryFetcherProps) {
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    suspense: true,
    ...queryOpt,
  });

  return renderFn(data);
}