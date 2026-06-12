"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  Gear,
  LinkSimple,
  MagnifyingGlass,
  Plus,
  X,
} from "@phosphor-icons/react";
import type { UserBrand } from "@/data/brandAccessStatic";

type AllBrandsModalProps = {
  open: boolean;
  onClose: () => void;
  brands: UserBrand[];
  activeBrandId: string | null;
  onBrandSelect: (brandId: string) => void;
  onBrandSettings: (brandId: string) => void;
  onCreateBrand: () => void;
  onJoinByInvite: () => void;
};

const rowClass =
  "flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

export function AllBrandsModal({
  open,
  onClose,
  brands,
  activeBrandId,
  onBrandSelect,
  onBrandSettings,
  onCreateBrand,
  onJoinByInvite,
}: AllBrandsModalProps) {
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(q) ||
        brand.industry?.toLowerCase().includes(q)
    );
  }, [brands, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => previouslyFocused?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close all brands"
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="All brands"
        tabIndex={-1}
        className="relative flex max-h-[80vh] w-full max-w-[560px] flex-col overflow-hidden rounded-lg border border-line bg-card-bg shadow-[0_24px_80px_-18px_rgba(0,0,0,0.75)] outline-none backdrop-blur-container"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-4">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-[-0.14px] text-text-inverse">
              All brands
            </p>
            <p className="mt-1 text-xs text-text-inverse-subtlest">
              Switch, search, or manage your brands
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onCreateBrand();
                onClose();
              }}
              className="flex h-8 items-center gap-1.5 rounded-sm border border-line px-3 text-xs font-medium text-text-inverse transition hover:bg-white/[0.06]"
            >
              <Plus size={14} />
              Create brand
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-rounded text-text-inverse-subtle transition hover:bg-white/[0.06] hover:text-text-inverse"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="shrink-0 border-b border-line px-4 py-3">
          <label className="flex h-9 items-center gap-2 rounded-sm border border-line bg-white/[0.04] px-3">
            <MagnifyingGlass
              size={16}
              className="shrink-0 text-text-inverse-subtlest"
              aria-hidden
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands"
              className="min-w-0 flex-1 bg-transparent text-sm text-text-inverse placeholder:text-text-inverse-subtlest focus:outline-none"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-text-inverse-subtlest">
              {query ? "No brands match your search." : "No brands yet."}
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {filtered.map((brand) => {
                const isActive = brand.id === activeBrandId;
                return (
                  <li key={brand.id}>
                    <div className="group flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onBrandSelect(brand.id);
                          onClose();
                        }}
                        className={`${rowClass} min-w-0 flex-1 ${
                          isActive ? "bg-white/[0.08]" : ""
                        }`}
                      >
                        <span className="relative size-8 shrink-0 overflow-hidden rounded-rounded">
                          <Image
                            src={brand.logoUrl}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-text-inverse">
                              {brand.name}
                            </span>
                            {isActive && (
                              <Check
                                size={14}
                                weight="bold"
                                className="shrink-0 text-primary-400"
                              />
                            )}
                          </span>
                          <span className="mt-0.5 block text-xs text-text-inverse-subtlest">
                            {brand.role === "owner" ? "Owner" : "Member"}
                            {brand.industry ? ` · ${brand.industry}` : ""}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={`${brand.name} settings`}
                        onClick={() => {
                          onBrandSettings(brand.id);
                          onClose();
                        }}
                        className="flex size-8 shrink-0 items-center justify-center rounded-sm text-text-inverse-subtle opacity-0 transition hover:bg-white/[0.06] hover:text-text-inverse group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <Gear size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-line px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onJoinByInvite();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-sm px-3 py-2 text-xs font-medium text-text-inverse-subtle transition hover:bg-white/[0.04] hover:text-text-inverse"
          >
            <LinkSimple size={14} />
            Join by invite link or code
          </button>
        </div>
      </div>
    </div>
  );
}
