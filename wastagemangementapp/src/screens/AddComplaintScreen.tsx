import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform,
  Image, Alert,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import { ComplaintError } from '../types/Complaint';
import axios from 'axios';
import { useComplaintContext } from '../context/ComplaintContext';

export default function AddComplaintScreen() {
  const { addComplaint, loading } = useComplaintContext();
  const [description, setDescription] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [districtName, setDistrictName] = useState('');      
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errors, setError] = useState<ComplaintError>({});

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');
  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermission();
    })();
  }, []);

  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
    if (!location) return;

    const fetchDistrict = async () => {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`,
          { headers: { 'User-Agent': 'waste-management-app' } },
        );
        const name =
          res.data.address?.state_district ||
          res.data.address?.county ||
          'Unknown';
        setDistrictName(name);
      } catch (error) {
        console.log('District fetch error:', error);
        setDistrictName('Unknown');
      }
    };

    fetchDistrict();
  }, [location]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const takePhoto = async () => {
    if (cameraRef.current == null) return;
    const photo = await cameraRef.current.takePhoto();
    setPhotoUri('file://' + photo.path);
    setShowCamera(false);
  };

  const handleAddComplaint = async () => {

    setError({});

    if (!photoUri) {
      setError(prev => ({ ...prev, image: 'Please provide an image' }));
      return;
    }
    if (!location) {
      setError(prev => ({ ...prev, location: 'Please provide valid location' }));
      return;
    }
    if (!description.trim()) {
      setError(prev => ({ ...prev, description: 'Description required' }));
      return;
    }
    if (!districtName) {
      setError(prev => ({ ...prev, location: 'Location not resolved yet, please wait' }));
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        'data',
        JSON.stringify({
          description,
          latitude: location.latitude,
          longitude: location.longitude,
          district: districtName,   
        }),
      );

      const compressed = await ImageResizer.createResizedImage(
        photoUri, 800, 800, 'JPEG', 70,
      );

      formData.append('image', {
        uri: compressed.uri,
        type: 'image/jpeg',
        name: 'complaint.jpg',
      } as any);

      const result = await addComplaint(formData);

      if (result) {
        Alert.alert('Success', 'Complaint added');
        setDescription('');
        setPhotoUri(null);
        setError({});
      } else {
        Alert.alert('Failed', 'Could not submit complaint');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>Report Waste Issue</Text>
            <Text style={styles.pageDescription}>
              Help us maintain our community by reporting environmental concerns.
            </Text>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Issue Details</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the issue..."
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
            {/* ✅ show description error */}
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {/* Image */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Visual Evidence</Text>
            <View style={styles.mediaContainer}>
              <TouchableOpacity
                style={styles.captureBox}
                onPress={() => setShowCamera(true)}
              >
                <Ionicons name="camera-outline" size={28} color="#666" />
                <Text style={styles.captureText}>Capture</Text>
              </TouchableOpacity>

              <View style={styles.imageBox}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.previewImage} />
                ) : (
                  <Feather name="image" size={24} color="#CCC" />
                )}
              </View>
            </View>
            {/* ✅ show image error */}
            {errors.image && (
              <Text style={styles.errorText}>{errors.image}</Text>
            )}
          </View>

          {/* Location */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapPlaceholder}>
              <Feather name="image" size={32} color="#CCC" />
              <View style={styles.addressOverlay}>
                <Ionicons name="location" size={20} color="#1F7A38" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.coordsText}>
                    {location
                      ? `${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°`
                      : 'Fetching location...'}
                  </Text>
                  {/* ✅ show district name */}
                  {districtName ? (
                    <Text style={styles.addressText}>{districtName}</Text>
                  ) : location ? (
                    <Text style={styles.addressText}>Resolving district...</Text>
                  ) : null}
                </View>
              </View>
            </View>
            {/* ✅ show location error */}
            {errors.location && (
              <Text style={styles.errorText}>{errors.location}</Text>
            )}
            <TouchableOpacity style={styles.refreshButton} onPress={getLocation}>
              <MaterialCommunityIcons name="crosshairs-gps" size={16} color="#666" />
              <Text style={styles.refreshText}>Refresh GPS</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={loading}
          style={[styles.submitButton, loading && { opacity: 0.6 }]}
          onPress={handleAddComplaint}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
          <Feather name="send" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {showCamera && device && (
        <View style={[StyleSheet.absoluteFill, styles.cameraContainer]}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity onPress={takePhoto} style={styles.captureBtn} />
          <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.cancelBtn}>
            <MaterialIcons name="cancel" color="black" size={34} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  titleSection: { marginBottom: 20 },
  pageTitle: { fontSize: 26, fontWeight: '800' },
  pageDescription: { fontSize: 14, color: '#666' },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  textArea: { backgroundColor: '#EAECEE', borderRadius: 16, padding: 16, minHeight: 120 },
  mediaContainer: { flexDirection: 'row', gap: 16 },
  captureBox: {
    width: 100, height: 100, borderRadius: 16,
    borderWidth: 1, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
  captureText: { fontSize: 12, marginTop: 5 },
  imageBox: {
    width: 100, height: 100, borderRadius: 16,
    backgroundColor: '#EEE', justifyContent: 'center',
    alignItems: 'center', overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  mapPlaceholder: {
    height: 200, backgroundColor: '#EEE', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  addressOverlay: {
    position: 'absolute', bottom: 10, left: 10, right: 10,
    backgroundColor: '#FFF', padding: 10, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center',
  },
  coordsText: { fontSize: 12, fontWeight: '700' },
  addressText: { fontSize: 11, color: '#666' },
  // ✅ new error style
  errorText: { fontSize: 12, color: '#E53935', marginTop: 6 },
  refreshButton: {
    flexDirection: 'row', justifyContent: 'center',
    padding: 12, backgroundColor: '#D0E4F5', borderRadius: 20,
  },
  refreshText: { marginLeft: 5 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 16 },
  submitButton: {
    backgroundColor: '#2E7D32', padding: 16, borderRadius: 30,
    flexDirection: 'row', justifyContent: 'center',
  },
  submitButtonText: { color: '#FFF', fontWeight: '700', marginRight: 8 },
  captureBtn: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF',
  },
  cancelBtn: { position: 'absolute', top: 50, left: 20 },
  cameraContainer: { margin: 10, borderRadius: 5 },
});