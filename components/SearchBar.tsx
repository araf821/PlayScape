"use client";

import { FC, useCallback, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/Command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Community, Prisma } from "@prisma/client";
import { CommandList } from "cmdk";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import Link from "next/link";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const request = debounce(() => {
    refetch();
  }, 250);

  const debounceRequest = useCallback(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];

      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Community & {
        _count: Prisma.CommunityCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  return (
    <Command
      ref={commandRef}
      className="relative z-50 max-w-lg overflow-visible rounded-lg bg-black/20 py-1 text-white"
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        placeholder="Search for communities..."
        className="border-none text-base outline-none ring-0 focus:border-none focus:outline-0"
      />

      {input.length > 0 ? (
        <CommandList className="absolute inset-x-0 top-full mt-1 rounded-md border border-zinc-700 bg-zinc-800 text-white shadow-md">
          {isFetched ? <CommandEmpty>No results found.</CommandEmpty> : null}

          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((community) => (
                <CommandItem
                  className="font-semibold text-white hover:bg-background hover:text-black"
                  key={community.id}
                  value={community.name}
                  onSelect={(e) => {
                    router.push(`/community/${e}`);
                    router.refresh();
                    setInput("");
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <Link href={`/community/${community.name}`}>
                    community/{community.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;
