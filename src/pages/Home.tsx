import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, MapPin, Loader2 } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGreeting } from "@/hooks/useGreeting";
import { getUser } from "@/services/auth";
import {
  searchDestinations,
  searchStartingPlaces,
  type Place,
} from "@/services/routes";
import { cn } from "@/lib/utils";

export default function Home() {
  const navigate = useNavigate();
  const user = getUser();
  const greeting = useGreeting(user?.first_name || user?.username || "Guest");

  // Input values
  const [destinationInput, setDestinationInput] = useState("");
  const [startingPointInput, setStartingPointInput] = useState("");

  // Selected places
  const [selectedDestination, setSelectedDestination] = useState<Place | null>(
    null
  );
  const [selectedStartingPoint, setSelectedStartingPoint] =
    useState<Place | null>(null);

  // Suggestions
  const [destinationSuggestions, setDestinationSuggestions] = useState<Place[]>(
    []
  );
  const [startingPointSuggestions, setStartingPointSuggestions] = useState<
    Place[]
  >([]);

  // Loading states
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [startingPointLoading, setStartingPointLoading] = useState(false);

  // Show dropdowns
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showStartingPointDropdown, setShowStartingPointDropdown] =
    useState(false);

  // Abort controllers
  const destinationAbortRef = useRef<AbortController | null>(null);
  const startingPointAbortRef = useRef<AbortController | null>(null);

  // Debounce timers
  const destinationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startingPointTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDestinationInput = useCallback((value: string) => {
    setDestinationInput(value);
    setSelectedDestination(null);
    setSelectedStartingPoint(null);
    setStartingPointInput("");
    setStartingPointSuggestions([]);

    // Cancel previous request
    if (destinationAbortRef.current) {
      destinationAbortRef.current.abort();
    }
    if (destinationTimeoutRef.current) {
      clearTimeout(destinationTimeoutRef.current);
    }

    if (value.trim().length >= 3) {
      setDestinationLoading(true);
      setShowDestinationDropdown(true);

      destinationTimeoutRef.current = setTimeout(async () => {
        destinationAbortRef.current = new AbortController();
        try {
          const places = await searchDestinations(
            value.trim(),
            destinationAbortRef.current.signal
          );
          setDestinationSuggestions(places);
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            setDestinationSuggestions([]);
          }
        } finally {
          setDestinationLoading(false);
        }
      }, 300);
    } else {
      setShowDestinationDropdown(false);
      setDestinationSuggestions([]);
      setDestinationLoading(false);
    }
  }, []);

  const handleStartingPointInput = useCallback(
    (value: string) => {
      setStartingPointInput(value);
      setSelectedStartingPoint(null);

      if (!selectedDestination) return;

      // Cancel previous request
      if (startingPointAbortRef.current) {
        startingPointAbortRef.current.abort();
      }
      if (startingPointTimeoutRef.current) {
        clearTimeout(startingPointTimeoutRef.current);
      }

      if (value.trim().length >= 3) {
        setStartingPointLoading(true);
        setShowStartingPointDropdown(true);

        startingPointTimeoutRef.current = setTimeout(async () => {
          startingPointAbortRef.current = new AbortController();
          try {
            const places = await searchStartingPlaces(
              selectedDestination.id,
              value.trim(),
              startingPointAbortRef.current.signal
            );
            setStartingPointSuggestions(places);
          } catch (error) {
            if ((error as Error).name !== "AbortError") {
              setStartingPointSuggestions([]);
            }
          } finally {
            setStartingPointLoading(false);
          }
        }, 300);
      } else {
        setShowStartingPointDropdown(false);
        setStartingPointSuggestions([]);
        setStartingPointLoading(false);
      }
    },
    [selectedDestination]
  );

  const selectDestination = (place: Place) => {
    setSelectedDestination(place);
    setDestinationInput(place.canonical_name);
    setShowDestinationDropdown(false);
    setDestinationSuggestions([]);
  };

  const selectStartingPoint = (place: Place) => {
    setSelectedStartingPoint(place);
    setStartingPointInput(place.canonical_name);
    setShowStartingPointDropdown(false);
    setStartingPointSuggestions([]);
  };

  const handleSwap = () => {
    const tempInput = destinationInput;
    const tempSelected = selectedDestination;

    setDestinationInput(startingPointInput);
    setSelectedDestination(selectedStartingPoint);
    setStartingPointInput(tempInput);
    setSelectedStartingPoint(tempSelected);
  };

  const handleSearch = () => {
    if (selectedDestination && selectedStartingPoint) {
      sessionStorage.setItem(
        "searchParams",
        JSON.stringify({
          from: selectedStartingPoint,
          to: selectedDestination,
        })
      );
      navigate("/routes");
    }
  };

  const canSearch = selectedDestination && selectedStartingPoint;

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-[calc(100vh-5rem)] justify-center px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground text-center mb-8 animate-fade-in">
          {greeting}
        </h1>

        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Destination Input */}
          <div className="relative">
            <Input
              placeholder="Where are you going?"
              value={destinationInput}
              onChange={(e) => handleDestinationInput(e.target.value)}
              onFocus={() =>
                destinationSuggestions.length > 0 &&
                setShowDestinationDropdown(true)
              }
              onBlur={() =>
                setTimeout(() => setShowDestinationDropdown(false), 200)
              }
              className="text-base pr-10"
            />
            {destinationLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
            )}

            {/* Destination Suggestions Dropdown */}
            {showDestinationDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-card border-2 border-primary/30 rounded-xl shadow-card-hover max-h-60 overflow-y-auto">
                {destinationLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : destinationSuggestions.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No destinations found
                  </div>
                ) : (
                  destinationSuggestions.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => selectDestination(place)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-2 tap-highlight-none"
                    >
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">
                        {place.canonical_name}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!selectedDestination && !selectedStartingPoint}
            className={cn(
              "mx-auto flex items-center justify-center w-10 h-10 rounded-full",
              "bg-muted text-muted-foreground transition-all duration-200",
              "hover:bg-primary hover:text-primary-foreground hover:rotate-180",
              "active:scale-90 tap-highlight-none disabled:opacity-50"
            )}
          >
            <ArrowDown className="h-5 w-5" />
          </button>

          {/* Starting Point Input */}
          <div className="relative">
            <Input
              placeholder={
                selectedDestination
                  ? "Where are you coming from?"
                  : "Select a destination first"
              }
              value={startingPointInput}
              onChange={(e) => handleStartingPointInput(e.target.value)}
              onFocus={() =>
                startingPointSuggestions.length > 0 &&
                setShowStartingPointDropdown(true)
              }
              onBlur={() =>
                setTimeout(() => setShowStartingPointDropdown(false), 200)
              }
              disabled={!selectedDestination}
              className="text-base pr-10"
            />
            {startingPointLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
            )}

            {/* Starting Point Suggestions Dropdown */}
            {showStartingPointDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-card border-2 border-primary/30 rounded-xl shadow-card-hover max-h-60 overflow-y-auto">
                {startingPointLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : startingPointSuggestions.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No starting points found
                  </div>
                ) : (
                  startingPointSuggestions.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => selectStartingPoint(place)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-2 tap-highlight-none"
                    >
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">
                        {place.canonical_name}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className="mt-8 flex justify-center animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <Button
            onClick={handleSearch}
            disabled={!canSearch}
            size="lg"
            className={cn("min-w-[180px]", canSearch && "animate-pulse-ring")}
          >
            Search Routes
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
