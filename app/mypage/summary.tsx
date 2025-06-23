import { fetchRunningSummary, submitRunningFeedback } from '@/api/running';
import FeedbackOverlay from '@/components/route/FeedBackOvelay';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RunningSummaryScreen() {
  const [showFeedback, setShowFeedback] = useState(true);
  const [rating, setRating] = useState(0);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [summary, setSummary] = useState<any>(null);

  const handleFeedbackSubmit = async () => {
    if (!rating || recommend === null || comment.trim() === '') {
      Alert.alert('알림', '모든 항목을 입력해주세요!');
      return;
    }

    try {
      await submitRunningFeedback({
        user_id: 123,
        rating,
        recommend,
        comment,
        completed_at: new Date().toISOString(),
      });
      setShowFeedback(false);
    } catch (err) {
      console.error('피드백 전송 실패:', err);
      Alert.alert('전송 실패', '피드백 전송에 실패했습니다.');
    }
  };

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchRunningSummary(123);
        setSummary(data);
      } catch (err) {
        console.error('러닝 요약 불러오기 실패', err);
      }
    };
    if (!showFeedback) loadSummary();
  }, [showFeedback]);

  return (
    <View style={styles.container}>
      {showFeedback && (
        <FeedbackOverlay
          rating={rating}
          setRating={setRating}
          recommend={recommend}
          setRecommend={setRecommend}
          comment={comment}
          setComment={setComment}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      {!showFeedback && summary && (
        <ScrollView>
          <View style={styles.summaryCard}>
            <Text style={styles.title}> 러닝 분석 결과</Text>
            <View style={styles.row}>
              <Text style={styles.metric}>
                <Text style={styles.big}>{summary.distance}</Text> km
              </Text>
              <Text style={styles.metric}>
                <Text style={styles.big}>{summary.duration}</Text> 분
              </Text>
              <Text style={styles.metric}>
                <Text style={styles.big}>{summary.avg_pace}</Text> 분/km
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            <View style={styles.statBox}>
              <FontAwesome5 name="road" size={20} color="#00B894" />
              <Text style={styles.statValue}>{summary.distance} km</Text>
              <Text style={styles.statLabel}>총 거리</Text>
            </View>
            <View style={styles.statBox}>
              <FontAwesome5 name="clock" size={20} color="#00B894" />
              <Text style={styles.statValue}>{summary.duration}분</Text>
              <Text style={styles.statLabel}>소요 시간</Text>
            </View>
            <View style={styles.statBox}>
              <FontAwesome5 name="tachometer-alt" size={20} color="#00B894" />
              <Text style={styles.statValue}>{summary.avg_pace}</Text>
              <Text style={styles.statLabel}>평균 페이스</Text>
            </View>
            <View style={styles.statBox}>
              <FontAwesome5 name="stop-circle" size={20} color="#f87171" />
              <Text style={styles.statValue}>{summary.stop_count}회</Text>
              <Text style={styles.statLabel}>정지 횟수</Text>
            </View>
            <View style={styles.statBox}>
              <FontAwesome5 name="heartbeat" size={20} color="#FFD700" />
              <Text style={styles.statValue}>{summary.feedback_summary.early_speed_deviation}</Text>
              <Text style={styles.statLabel}>페이스 안정성</Text>
            </View>
            <View style={styles.statBox}>
              <FontAwesome5 name="bolt" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{summary.focus_rate}%</Text>
              <Text style={styles.statLabel}>러닝 집중도</Text>
            </View>
          </View>

          <View style={styles.feedback}>
            <View style={styles.feedbackRow}>
              <FontAwesome5 name="robot" size={18} color="#999" style={{ marginRight: 8 }} />
              <Text style={styles.feedbackText}>{summary.feedback_summary.main}</Text>
            </View>
            <View style={styles.feedbackRow}>
              <FontAwesome5 name="comment-alt" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text style={styles.feedbackSub}>{summary.feedback_summary.advice}</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  summaryCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    margin: 20,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  big: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    color: '#00B894',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
  },
  statLabel: {
    color: '#ccc',
    fontSize: 13,
  },
  feedback: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1,
  },
  feedbackSub: {
    color: '#ccc',
    fontSize: 13,
    flexShrink: 1,
  },
});
