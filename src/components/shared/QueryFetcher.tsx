import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";

interface QueryFetcherProps {
  queryFn: () => Promise<any>;
  queryOpt: UseQueryOptions<unknown, Error, unknown, string[]>;
  renderFn: (data: any) => JSX.Element | null;
}
export default function QueryFetcher({ queryFn, queryOpt, renderFn }: QueryFetcherProps) {
  const { data } = useSuspenseQuery({
    queryFn: queryFn,
    ...queryOpt
  });

  return renderFn(data);
}
