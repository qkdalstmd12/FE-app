import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Props = {
  rating: number;
  setRating: (val: number) => void;
  recommend: boolean | null;
  setRecommend: (val: boolean) => void;
  comment: string;
  setComment: (val: string) => void;
  onSubmit: () => void;
};

const FeedbackOverlay: React.FC<Props> = ({
  rating,
  setRating,
  recommend,
  setRecommend,
  comment,
  setComment,
  onSubmit,
}) => {
  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardWrapper}
      >
        <View style={styles.box}>
          <Text style={styles.label}>러닝 만족도</Text>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)}>
                <Text style={styles.star}>{rating >= n ? '⭐' : '☆'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>추천하시겠어요?</Text>
          <View style={styles.recommendRow}>
            <TouchableOpacity
              style={[styles.choice, recommend === true && styles.selected]}
              onPress={() => setRecommend(true)}
            >
              <Text>👍 예</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.choice, recommend === false && styles.selected]}
              onPress={() => setRecommend(false)}
            >
              <Text>👎 아니오</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>코멘트</Text>
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={(text) => {
              if (text.length <= 15) setComment(text);
            }}
            placeholder="최대 15자"
            placeholderTextColor="#888"
            multiline
            maxLength={15}
          />

          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>러닝 통계 보기 버튼</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FeedbackOverlay;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  keyboardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 26,
    marginHorizontal: 2,
  },
  recommendRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 8,
  },
  choice: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  selected: {
    backgroundColor: '#00B894',
  },
  input: {
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontSize: 14,
    color: '#000',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
