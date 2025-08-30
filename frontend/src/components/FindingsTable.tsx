import { useState } from "react";
import { Finding, ComplianceLabel, Severity, ReviewStatus } from "@/types/compliance";
import { ComplianceLabel as ComplianceLabelComponent } from "./ComplianceLabel";
import { SeverityIndicator } from "./SeverityIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FindingsTableProps {
  findings: Finding[];
  onReviewChange: (findingId: string, review: ReviewStatus) => void;
}

export function FindingsTable({ findings, onReviewChange }: FindingsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<ComplianceLabel[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [expandedReasoning, setExpandedReasoning] = useState<Set<string>>(new Set());

  const itemsPerPage = 10;
  
  // Get unique values for filters
  const uniqueGeos = Array.from(new Set(findings.map(f => f.geo)));
  const uniqueLabels = Array.from(new Set(findings.map(f => f.label)));
  const uniqueSeverities = Array.from(new Set(findings.map(f => f.severity)));

  // Filter findings
  const filteredFindings = findings.filter(finding => {
    const matchesSearch = !searchTerm || 
      finding.law.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.reasoning.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGeo = selectedGeos.length === 0 || selectedGeos.includes(finding.geo);
    const matchesLabel = selectedLabels.length === 0 || selectedLabels.includes(finding.label);
    const matchesSeverity = selectedSeverities.length === 0 || selectedSeverities.includes(finding.severity);

    return matchesSearch && matchesGeo && matchesLabel && matchesSeverity;
  });

  // Paginate results
  const totalPages = Math.ceil(filteredFindings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFindings = filteredFindings.slice(startIndex, startIndex + itemsPerPage);

  const toggleExpanded = (findingId: string) => {
    const newExpanded = new Set(expandedReasoning);
    if (newExpanded.has(findingId)) {
      newExpanded.delete(findingId);
    } else {
      newExpanded.add(findingId);
    }
    setExpandedReasoning(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    switch (type) {
      case 'geo':
        setSelectedGeos(prev => 
          checked ? [...prev, value] : prev.filter(v => v !== value)
        );
        break;
      case 'label':
        setSelectedLabels(prev => 
          checked ? [...prev, value as ComplianceLabel] : prev.filter(v => v !== value)
        );
        break;
      case 'severity':
        setSelectedSeverities(prev => 
          checked ? [...prev, value as Severity] : prev.filter(v => v !== value)
        );
        break;
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by law or reasoning..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {/* Geo Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Jurisdictions</Label>
                <div className="flex flex-wrap gap-2">
                  {uniqueGeos.map(geo => (
                    <div key={geo} className="flex items-center space-x-2">
                      <Checkbox
                        id={geo}
                        checked={selectedGeos.includes(geo)}
                        onCheckedChange={(checked) => 
                          handleFilterChange('geo', geo, checked as boolean)
                        }
                      />
                      <Label htmlFor={geo} className="text-sm">{geo}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Label Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Labels</Label>
                <div className="flex flex-wrap gap-2">
                  {uniqueLabels.map(label => (
                    <div key={label} className="flex items-center space-x-2">
                      <Checkbox
                        id={label}
                        checked={selectedLabels.includes(label)}
                        onCheckedChange={(checked) => 
                          handleFilterChange('label', label, checked as boolean)
                        }
                      />
                      <Label htmlFor={label} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Severity Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Severity</Label>
                <div className="flex flex-wrap gap-2">
                  {uniqueSeverities.map(severity => (
                    <div key={severity} className="flex items-center space-x-2">
                      <Checkbox
                        id={severity}
                        checked={selectedSeverities.includes(severity)}
                        onCheckedChange={(checked) => 
                          handleFilterChange('severity', severity, checked as boolean)
                        }
                      />
                      <Label htmlFor={severity} className="text-sm">{severity}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedGeos.length > 0 || selectedLabels.length > 0 || selectedSeverities.length > 0 || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedGeos([]);
                  setSelectedLabels([]);
                  setSelectedSeverities([]);
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredFindings.length)} of {filteredFindings.length} findings
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border p-3 text-left text-sm font-medium">Geo</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Law</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Label</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Severity</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Confidence</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Controls</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Reasoning</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Evidence</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Citations</th>
              <th className="border border-border p-3 text-left text-sm font-medium">Review</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFindings.map((finding, index) => (
              <tr key={finding.id} className={cn(
                "hover:bg-muted/30 transition-colors",
                index % 2 === 0 ? "bg-background" : "bg-muted/20"
              )}>
                <td className="border border-border p-3">
                  <Badge variant="outline">{finding.geo}</Badge>
                </td>
                <td className="border border-border p-3 max-w-[200px]">
                  <div className="font-medium text-sm">{finding.law}</div>
                </td>
                <td className="border border-border p-3">
                  <ComplianceLabelComponent label={finding.label} />
                </td>
                <td className="border border-border p-3">
                  <SeverityIndicator severity={finding.severity} />
                </td>
                <td className="border border-border p-3 text-center">
                  <span className="font-medium">{finding.confidence}%</span>
                </td>
                <td className="border border-border p-3 max-w-[250px]">
                  <div className="text-sm">{truncateText(finding.controls, 80)}</div>
                </td>
                <td className="border border-border p-3 max-w-[300px]">
                  <div className="text-sm">
                    {expandedReasoning.has(finding.id) ? (
                      <>
                        {finding.reasoning}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(finding.id)}
                          className="ml-2 h-auto p-0 text-primary"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {truncateText(finding.reasoning, 100)}
                        {finding.reasoning.length > 100 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(finding.id)}
                            className="ml-2 h-auto p-0 text-primary"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="border border-border p-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Evidence Snippet</h4>
                        <p className="text-sm text-muted-foreground">
                          {finding.evidence_snippet}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
                <td className="border border-border p-3 max-w-[200px]">
                  <div className="space-y-1">
                    {finding.citations.map((citation, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {citation}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="border border-border p-3">
                  <RadioGroup
                    value={finding.review || "Confirm"}
                    onValueChange={(value) => onReviewChange(finding.id, value as ReviewStatus)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Confirm" id={`confirm-${finding.id}`} />
                      <Label htmlFor={`confirm-${finding.id}`} className="text-xs">Confirm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Reject" id={`reject-${finding.id}`} />
                      <Label htmlFor={`reject-${finding.id}`} className="text-xs">Reject</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Needs follow-up" id={`followup-${finding.id}`} />
                      <Label htmlFor={`followup-${finding.id}`} className="text-xs">Follow-up</Label>
                    </div>
                  </RadioGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}