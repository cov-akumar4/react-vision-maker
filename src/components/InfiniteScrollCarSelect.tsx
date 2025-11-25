import { useEffect, useRef, useState, useCallback } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/lib/supabase';

interface Car {
    id_unico: string;
    name: string;
    model: string;
    license_plate: string;
}

interface InfiniteScrollCarSelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function InfiniteScrollCarSelect({
    value,
    onValueChange,
    placeholder = "Select a car...",
    className,
}: InfiniteScrollCarSelectProps) {
    const [open, setOpen] = useState(false);
    const [cars, setCars] = useState<Car[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const observerTarget = useRef<HTMLDivElement>(null);

    const PAGE_SIZE = 5;

    const fetchCars = useCallback(async (pageNum: number, search: string = '') => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            let query = supabase
                .from('cars')
                .select('id_unico, name, model, license_plate')
                .order('created_at', { ascending: false });

            // Apply search filter if exists
            if (search.trim()) {
                query = query.or(`id_unico.ilike.%${search}%,name.ilike.%${search}%,model.ilike.%${search}%,license_plate.ilike.%${search}%`);
            }

            // Apply pagination
            const from = pageNum * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            query = query.range(from, to);

            const { data, error } = await query;

            if (error) throw error;

            if (data && data.length > 0) {
                if (pageNum === 0) {
                    setCars(data);
                } else {
                    setCars(prev => [...prev, ...data]);
                }
                setHasMore(data.length === PAGE_SIZE);
            } else {
                setHasMore(false);
                if (pageNum === 0) {
                    setCars([]);
                }
            }
        } catch (err) {
            console.error('Error fetching cars:', err);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    // Initial fetch when dropdown opens
    useEffect(() => {
        if (open && cars.length === 0) {
            setPage(0);
            fetchCars(0);
        }
    }, [open, fetchCars]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!open) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchCars(nextPage, searchTerm);
                }
            },
            { threshold: 1.0 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [open, hasMore, isLoading, page, fetchCars, searchTerm]);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (open) {
                setPage(0);
                setCars([]);
                setHasMore(true);
                fetchCars(0, searchTerm);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, open]);

    const selectedCar = cars.find((car) => car.id_unico === value);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {selectedCar ? (
                        <span className="truncate">
                            {selectedCar.name} {selectedCar.model}
                        </span>
                    ) : (
                        placeholder
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" side="bottom" align="start" sideOffset={5} avoidCollisions={false}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search cars..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList className="max-h-[200px]">
                        <CommandEmpty>
                            {isLoading ? "Loading..." : "No cars found."}
                        </CommandEmpty>
                        <CommandGroup>
                            {cars.map((car) => (
                                <CommandItem
                                    key={car.id_unico}
                                    value={car.id_unico}
                                    onSelect={(currentValue) => {
                                        onValueChange?.(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === car.id_unico ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {car.name} {car.model}
                                </CommandItem>
                            ))}
                            {hasMore && (
                                <div ref={observerTarget} className="py-2 text-center text-sm text-muted-foreground">
                                    {isLoading ? "Loading more..." : "Scroll for more"}
                                </div>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
