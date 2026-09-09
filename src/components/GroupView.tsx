import React, { useState } from 'react';
import {
  Users,
  Heart,
  XCircle,
  Sparkles,
  ThumbsUp,
  CheckCircle2,
  PlusCircle,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Trip, GroupMember, GroupPoll, PollOption } from '../types';

interface GroupViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
}

export const GroupView: React.FC<GroupViewProps> = ({ trip, onUpdateTrip }) => {
  const [newSuggestionTitle, setNewSuggestionTitle] = useState('');
  const [isAddingSuggestion, setIsAddingSuggestion] = useState(false);

  // Filter current user
  const currentUser = trip.members.find((m) => m.isCurrentUser) || trip.members[0];

  // Calculate settlement balances
  // Specifically track "You owe X" or "X owes you"
  const settlements = [
    {
      fromMemberId: 'user-current',
      toMemberId: 'member-adam',
      toName: 'Adam',
      amount: 60,
      reason: 'Dinner at Asakusa Izakaya (RM240 total)',
      isPaid: false,
    },
    {
      fromMemberId: 'member-sarah',
      toMemberId: 'user-current',
      toName: 'You',
      amount: 245,
      reason: 'Shinjuku Granbell Hotel deposit',
      isPaid: false,
    },
  ];

  const [settlementList, setSettlementList] = useState(settlements);

  const handleVote = (pollId: string, optionId: string) => {
    const updatedPolls = trip.polls.map((poll) => {
      if (poll.id !== pollId) return poll;

      const updatedOptions = poll.options.map((opt) => {
        const hasVoted = opt.votes.includes(currentUser.id);
        if (opt.id === optionId) {
          return {
            ...opt,
            votes: hasVoted
              ? opt.votes.filter((id) => id !== currentUser.id)
              : [...opt.votes, currentUser.id],
          };
        }
        return opt;
      });

      return { ...poll, options: updatedOptions };
    });

    onUpdateTrip({ ...trip, polls: updatedPolls });
  };

  const handleAddPollSuggestion = (pollId: string) => {
    if (!newSuggestionTitle.trim()) return;

    const newOpt: PollOption = {
      id: `opt-${Date.now()}`,
      title: newSuggestionTitle,
      votes: [currentUser.id],
      suggestedBy: currentUser.name,
      icon: '✨',
    };

    const updatedPolls = trip.polls.map((poll) => {
      if (poll.id !== pollId) return poll;
      return {
        ...poll,
        options: [...poll.options, newOpt],
      };
    });

    onUpdateTrip({ ...trip, polls: updatedPolls });
    setNewSuggestionTitle('');
    setIsAddingSuggestion(false);
  };

  const handleMarkAsPaid = (index: number) => {
    const updated = [...settlementList];
    updated[index].isPaid = true;
    setSettlementList(updated);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div id="group-view-container" className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Group Collaboration & Splitting</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
              {trip.members.length} Travellers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate interests, vote on daily activities, and settle shared trip debts fairly.
          </p>
        </div>

        <button
          onClick={() => {
            const email = prompt('Enter companion email or handle to invite:');
            if (email) {
              alert(`Invitation link sent to ${email}!`);
            }
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Invite Member</span>
        </button>
      </div>

      {/* 10. Group Match AI Banner */}
      <div
        id="group-match-ai-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-7 shadow-md"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-purple-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Preference Engine</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                82% Group Match
              </h3>
              <span className="text-xs text-purple-200 font-medium">
                High alignment across all 4 travellers
              </span>
            </div>

            <p className="text-purple-100 text-sm leading-relaxed">
              "Everyone enjoys <strong className="text-white font-bold">food, culture, and photography</strong>. Sarah prefers to avoid steep long hikes, while Adam prefers skipping indoor shopping malls."
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1.5 shrink-0">
            <span className="font-bold text-purple-100 uppercase tracking-wider block text-[10px]">
              AI Recommended Activity:
            </span>
            <div className="font-bold text-white text-sm">
              Tsukiji Outer Market & Asakusa
            </div>
            <p className="text-purple-200 text-[11px]">
              100% satisfaction score for all 4 travellers.
            </p>
          </div>
        </div>
      </div>

      {/* 10. Member Cards with Preferences */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Traveller Preference Profiles</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trip.members.map((member) => (
            <div
              key={member.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                    {member.isCurrentUser && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{member.role}</span>
                </div>
              </div>

              {/* Likes & Dislikes */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Loves
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.likes.map((like, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium flex items-center gap-1"
                      >
                        <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                        <span>{like}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {member.dislikes.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Dislikes
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {member.dislikes.map((dislike, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-1"
                        >
                          <XCircle className="w-2.5 h-2.5 text-slate-400" />
                          <span>{dislike}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 11. Group Voting Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Active Poll
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Where should we go on Saturday?
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cast your vote or suggest an alternative. The winning option is automatically added to
              the Day 1 itinerary.
            </p>
          </div>

          <button
            onClick={() => setIsAddingSuggestion(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Suggestion</span>
          </button>
        </div>

        {/* Poll Options List */}
        {trip.polls.length > 0 && (
          <div className="space-y-3">
            {(() => {
              const activePoll = trip.polls[0];
              // Calculate highest votes
              const maxVotes = Math.max(...activePoll.options.map((o) => o.votes.length));

              return activePoll.options.map((option) => {
                const voteCount = option.votes.length;
                const isWinning = voteCount === maxVotes && voteCount > 0;
                const hasVoted = option.votes.includes(currentUser.id);

                return (
                  <div
                    key={option.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isWinning
                        ? 'bg-amber-50/60 border-amber-300 shadow-xs ring-1 ring-amber-300/30'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon || '📍'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{option.title}</h4>
                          {isWinning && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                              <Award className="w-3 h-3" />
                              <span>Leading Choice</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Suggested by <span className="font-semibold text-slate-700">{option.suggestedBy}</span>
                          {option.estimatedCost ? ` • Est. ${trip.currency}${option.estimatedCost}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {/* Voted Member Avatars */}
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {option.votes.map((voterId) => {
                          const member = trip.members.find((m) => m.id === voterId);
                          return (
                            <img
                              key={voterId}
                              src={member?.avatar}
                              alt={member?.name || 'Voter'}
                              title={member?.name}
                              className="w-6 h-6 rounded-full ring-2 ring-white object-cover"
                            />
                          );
                        })}
                      </div>

                      {/* Vote Button */}
                      <button
                        onClick={() => handleVote(activePoll.id, option.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          hasVoted
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white' : ''}`} />
                        <span>
                          {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Suggestion Add Input */}
        {isAddingSuggestion && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Add an activity suggestion for voting</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSuggestionTitle}
                onChange={(e) => setNewSuggestionTitle(e.target.value)}
                placeholder="e.g. Roppongi Hills Observation Deck"
                className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={() => handleAddPollSuggestion(trip.polls[0].id)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Submit
              </button>
              <button
                onClick={() => setIsAddingSuggestion(false)}
                className="px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 13. Expense Splitting Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Group Expense Splitting</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear calculation of who paid and who owes whom.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
            Fair 4-Way Equal Split
          </span>
        </div>

        {/* Settlement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settlementList.map((settlement, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                settlement.isPaid
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Settlement Summary
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {settlement.fromMemberId === 'user-current'
                      ? `You owe ${settlement.toName}`
                      : `${settlement.toName} owes You`}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{settlement.reason}</p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-slate-900">
                    {trip.currency} {settlement.amount}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {settlement.isPaid ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>Settled & Paid</span>
                  </span>
                ) : (
                  <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                    Payment Pending
                  </span>
                )}

                {!settlement.isPaid && (
                  <button
                    onClick={() => handleMarkAsPaid(idx)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Paid</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
