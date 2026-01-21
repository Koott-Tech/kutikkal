"use client"

import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import {
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { MoreVertical, Eye, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { format } from "date-fns"

const weekDays = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function SessionsFilterTable({ 
  sessions = [], 
  isLoading = false,
  onViewSession,
  currentPage = 1,
  totalPages = 1,
  totalSessions = 0,
  onPageChange,
}) {
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [dateFilter, setDateFilter] = useState("currentMonth") // currentMonth, week, month, year, custom
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedWeekDays, setSelectedWeekDays] = useState(new Set())
  const [dateRange, setDateRange] = useState(undefined)

  // Set default to current month
  useEffect(() => {
    const now = new Date()
    setSelectedMonth(now.getMonth())
    setSelectedYear(now.getFullYear())
  }, [])

  const getDateRange = () => {
    const now = new Date()
    let from, to

    switch (dateFilter) {
      case "currentMonth":
        from = new Date(now.getFullYear(), now.getMonth(), 1)
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case "week":
        const dayOfWeek = now.getDay()
        from = new Date(now)
        from.setDate(now.getDate() - dayOfWeek)
        from.setHours(0, 0, 0, 0)
        to = new Date(from)
        to.setDate(from.getDate() + 6)
        to.setHours(23, 59, 59, 999)
        break
      case "month":
        from = new Date(selectedYear, selectedMonth, 1)
        to = new Date(selectedYear, selectedMonth + 1, 0)
        break
      case "year":
        from = new Date(selectedYear, 0, 1)
        to = new Date(selectedYear, 11, 31)
        break
      case "custom":
        from = dateRange?.from
        to = dateRange?.to
        break
      default:
        from = null
        to = null
    }

    return { from, to }
  }

  const filteredData = useMemo(() => {
    let filtered = [...sessions]

    // Status filter
    if (status !== "All") {
      filtered = filtered.filter(s => s.status === status)
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(s => {
        const clientName = `${s.client?.first_name || ''} ${s.client?.last_name || ''}`.toLowerCase()
        const psychologistName = `${s.psychologist?.first_name || ''} ${s.psychologist?.last_name || ''}`.toLowerCase()
        const clientEmail = s.client?.user?.email?.toLowerCase() || ''
        const sessionId = s.id?.toString().toLowerCase() || ''
        
        return clientName.includes(searchLower) ||
               psychologistName.includes(searchLower) ||
               clientEmail.includes(searchLower) ||
               sessionId.includes(searchLower)
      })
    }

    // Date range filter
    const { from, to } = getDateRange()
    if (from && to) {
      filtered = filtered.filter(s => {
        if (!s.scheduled_date) return false
        const sessionDate = new Date(s.scheduled_date)
        return sessionDate >= from && sessionDate <= to
      })
    }

    // Week days filter
    if (selectedWeekDays.size > 0) {
      filtered = filtered.filter(s => {
        if (!s.scheduled_date) return false
        const sessionDate = new Date(s.scheduled_date)
        const dayOfWeek = sessionDate.getDay()
        return selectedWeekDays.has(dayOfWeek)
      })
    }

    return filtered
  }, [sessions, search, status, dateFilter, selectedMonth, selectedYear, selectedWeekDays, dateRange])

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }

  const toggleWeekDay = (dayValue) => {
    setSelectedWeekDays((prev) => {
      const newSet = new Set(prev)
      newSet.has(dayValue) ? newSet.delete(dayValue) : newSet.add(dayValue)
      return newSet
    })
  }

  const formatTime = (time) => {
    if (!time) return 'N/A'
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status, session) => {
    const isTimePassed = () => {
      if (!session.scheduled_date || !session.scheduled_time) return false
      const sessionDateTime = new Date(`${session.scheduled_date}T${session.scheduled_time}`)
      return sessionDateTime < new Date()
    }

    const displayStatus = status === 'booked' && isTimePassed() ? 'No Show' : status
    const variant = displayStatus === 'completed' ? 'secondary' : 
                   displayStatus === 'cancelled' ? 'destructive' : 
                   displayStatus === 'no_show' ? 'destructive' : 'default'

    return <Badge variant={variant}>{displayStatus}</Badge>
  }

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case "currentMonth":
        return `Current Month (${format(new Date(), 'MMMM yyyy')})`
      case "week":
        const { from } = getDateRange()
        return `This Week (${format(from, 'MMM d')} - ${format(new Date(from.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d')})`
      case "month":
        return `${months[selectedMonth]} ${selectedYear}`
      case "year":
        return selectedYear.toString()
      case "custom":
        if (dateRange?.from && dateRange?.to) {
          return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
        }
        return "Custom Range"
      default:
        return "All Dates"
    }
  }

  const statuses = ['All', 'booked', 'completed', 'cancelled', 'rescheduled', 'no_show']

  // Generate years for dropdown (current year ± 5 years)
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i)

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Super Mega Filters */}
      <div className="p-4 flex flex-col gap-3 md:flex-row md:flex-wrap items-start md:items-center border-b border-gray-200">
        <Input
          placeholder="Search by client, psychologist, email, or session ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/4"
        />

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[120px] justify-between">
              {status}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statuses.map((s) => (
              <DropdownMenuItem key={s} onClick={() => setStatus(s)}>
                {s === 'no_show' ? 'No Show' : s.charAt(0).toUpperCase() + s.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter Type */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[180px] justify-between">
              {getDateFilterLabel()}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => setDateFilter("currentMonth")}>
              Current Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("week")}>
              This Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("month")}>
              Select Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("year")}>
              Select Year
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("custom")}>
              Custom Range
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateFilter("all")}>
              All Dates
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Month Selector (when month filter is selected) */}
        {dateFilter === "month" && (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px]">
                  {months[selectedMonth]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {months.map((month, index) => (
                  <DropdownMenuItem key={index} onClick={() => setSelectedMonth(index)}>
                    {month}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[100px]">
                  {selectedYear}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {years.map((year) => (
                  <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Year Selector (when year filter is selected) */}
        {dateFilter === "year" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[100px]">
                {selectedYear}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {years.map((year) => (
                <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Custom Date Range */}
        {dateFilter === "custom" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[200px]">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                  : "Select Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Week Days Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px] justify-between">
              {selectedWeekDays.size === 0 
                ? "Week Days" 
                : selectedWeekDays.size === 7 
                ? "All Days" 
                : `${selectedWeekDays.size} Selected`}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {weekDays.map((day) => (
              <DropdownMenuCheckboxItem
                key={day.value}
                checked={selectedWeekDays.has(day.value)}
                onCheckedChange={() => toggleWeekDay(day.value)}
              >
                {day.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3f2e73]"></div>
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10 border-b">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                    onCheckedChange={(checked) =>
                      setSelectedRows(checked ? new Set(filteredData.map((d) => d.id)) : new Set())
                    }
                  />
                </TableHead>
                <TableHead>Session Details</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Psychologist</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((session) => (
                  <TableRow key={session.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.has(session.id)} 
                        onCheckedChange={() => toggleRow(session.id)} 
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          Session #{session.id?.slice(0, 8)}
                          {session.session_type === 'free_assessment' && (
                            <Badge variant="secondary" className="ml-2">Free Assessment</Badge>
                          )}
                          {(session.session_type === 'assessment' || session.type === 'assessment') && (
                            <Badge variant="secondary" className="ml-2">Assessment</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                        </div>
                        {session.package && (
                          <div className="text-xs text-gray-400">
                            Package: {session.package.package_type}
                            {(() => {
                              const pkg = session.package || {};
                              const totalSessions = pkg.total_sessions || pkg.session_count || 0;
                              const completedSessions = pkg.completed_sessions;
                              
                              // If we have both values, show completion status
                              if (totalSessions > 0 && completedSessions !== undefined && completedSessions !== null) {
                                return ` (${completedSessions}/${totalSessions} completed)`;
                              } else if (totalSessions > 0) {
                                return ` (${totalSessions} sessions)`;
                              }
                              return '';
                            })()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {session.client?.first_name} {session.client?.last_name}
                      </div>
                      {session.client?.child_name && (
                        <div className="text-xs text-gray-500">
                          Child: {session.client.child_name} ({session.client.child_age} years)
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {session.session_type === 'free_assessment' ? (
                        <div className="text-sm text-gray-900">Free Assessment</div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {session.psychologist?.first_name} {session.psychologist?.last_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(session.status, session)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onViewSession && onViewSession(session)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter className="sticky bottom-0 bg-white border-t">
              <TableRow>
                <TableCell colSpan={5}>Total Sessions</TableCell>
                <TableCell className="font-medium">{filteredData.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </div>
  )
}
