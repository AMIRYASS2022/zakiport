import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';

interface GalleryImage {
  filename: string;
  url: string;
  size: number;
  uploadDate: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log('API Base URL:', API_BASE_URL);

const Gallery3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [useDefaultImages, setUseDefaultImages] = useState(true);
  const [backendImages, setBackendImages] = useState<GalleryImage[]>([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images from backend API
  const loadBackendImages = async () => {
    try {
      setIsLoadingBackend(true);
      console.log('Loading backend images from:', `${API_BASE_URL}/api/gallery/images`);
      const response = await fetch(`${API_BASE_URL}/api/gallery/images`);
      const data = await response.json();
      console.log('Backend response:', data);
      
      if (data.success && data.images.length > 0) {
        console.log(`Found ${data.images.length} images from backend`);
        setBackendImages(data.images);
        setUseDefaultImages(false);
        // Convert backend image URLs to full URLs for Three.js texture loader
        const imageUrls = data.images.map((img: GalleryImage) => `${API_BASE_URL}${img.url}`);
        console.log('Setting custom images:', imageUrls);
        setCustomImages(imageUrls);
      } else {
        console.log('No images found in backend, using placeholders');
        // Fallback to default behavior if no backend images
        setUseDefaultImages(true);
      }
    } catch (error) {
      console.error('Error loading backend images:', error);
      setUseDefaultImages(true);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  // Upload images to backend
  const uploadImagesToBackend = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        // Reload images from backend after upload
        await loadBackendImages();
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    mountRef.current.appendChild(renderer.domElement);

    // Drag and drop functionality
    const dragOverlay = document.getElementById('drag-overlay');

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (dragOverlay) dragOverlay.style.opacity = '1';
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (dragOverlay) dragOverlay.style.opacity = '0';
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      if (dragOverlay) dragOverlay.style.opacity = '0';
      const files = Array.from(e.dataTransfer!.files).filter(file => file.type.startsWith('image/')).slice(0, 10);
      if (files.length === 0) return;
      
      // Upload to backend instead of using local URLs
      await uploadImagesToBackend(files);
    };

    mountRef.current.addEventListener('dragenter', handleDragEnter);
    mountRef.current.addEventListener('dragleave', handleDragLeave);
    mountRef.current.addEventListener('dragover', handleDragOver);
    mountRef.current.addEventListener('drop', handleDrop);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    scene.add(dirLight);

    // Gallery group
    const group = new THREE.Group();
    group.name = 'RotatingImages';
    scene.add(group);

    const rotationPeriod = 32;
    const radius = 5.2;
    const w = 2.4;
    const h = 3.2;
    const depth = 0.06;
    const glowShader = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x7aa8ff) },
        width: { value: 0.085 },
        intensity: { value: 1.0 }
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 color; uniform float width; uniform float intensity; varying vec2 vUv; float e(vec2 uv){ float x=min(uv.x,1.0-uv.x); float y=min(uv.y,1.0-uv.y); return min(x,y);} void main(){ float d=e(vUv); float a=smoothstep(width,0.0,d); gl_FragColor=vec4(color*intensity,a); }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    function enhanceTexture(texture: THREE.Texture, opts?: { contrast?: number; brightness?: number; saturation?: number }) {
      const img: any = texture.image;
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const contrast = (opts?.contrast ?? 1.12);
      const brightness = (opts?.brightness ?? 1.04);
      const saturation = (opts?.saturation ?? 1.08);
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        r = (r - 128) * contrast + 128;
        g = (g - 128) * contrast + 128;
        b = (b - 128) * contrast + 128;
        r = r * brightness;
        g = g * brightness;
        b = b * brightness;
        const avg = 0.299 * r + 0.587 * g + 0.114 * b;
        r = avg + (r - avg) * saturation;
        g = avg + (g - avg) * saturation;
        b = avg + (b - avg) * saturation;
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }
      ctx.putImageData(imageData, 0, 0);
      const ctex = new THREE.CanvasTexture(canvas);
      ctex.colorSpace = THREE.SRGBColorSpace;
      ctex.anisotropy = 8;
      return ctex;
    }

    // Create placeholder textures
    function makePlaceholderTexture(label: string) {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d')!;
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grd.addColorStop(0, '#e6e9ef');
      grd.addColorStop(1, '#f6f7f9');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#2b2b2b';
      ctx.font = 'bold 72px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, canvas.width / 2, canvas.height / 2);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      return tex;
    }

    // Create image frames
    for (let i = 0; i < 10; i++) {
      const label = `Image${String(i + 1).padStart(2, '0')}`;
      const tex = makePlaceholderTexture(label);
      
      const front = new THREE.MeshStandardMaterial({ 
        map: tex, 
        roughness: 0.35, 
        metalness: 0.0, 
        transparent: true, 
        opacity: 0 
      });
      const back = new THREE.MeshStandardMaterial({ 
        map: tex, 
        roughness: 0.35, 
        metalness: 0.0, 
        transparent: true, 
        opacity: 0 
      });
      const side = new THREE.MeshStandardMaterial({ color: 0xe6e6e6, roughness: 0.7, metalness: 0.0 });
      const materials = [side, side, side, side, front, back];
    
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth, 1, 1, 1), materials);
      box.receiveShadow = true;
      box.castShadow = true;
      const deg = i * 36;
      const rad = deg * Math.PI / 180;
      const x = radius * Math.cos(rad);
      const z = radius * Math.sin(rad);
      box.position.set(x, 0, z);
      box.lookAt(0, 0, 0);
      box.rotateY(Math.PI);
      box.name = `Image${String(i + 1).padStart(2, '0')}`;
      const gf = new THREE.Mesh(new THREE.PlaneGeometry(w*1.03, h*1.03), glowShader.clone());
      (gf.material as THREE.ShaderMaterial).uniforms.width.value = 0.04;
      (gf.material as THREE.ShaderMaterial).uniforms.intensity.value = 0.35;
      gf.position.set(0,0,depth/2+0.002);
      gf.renderOrder = 2;
      const gb = new THREE.Mesh(new THREE.PlaneGeometry(w*1.05, h*1.05), glowShader.clone());
      gb.position.set(0,0,-depth/2-0.002);
      gb.rotateY(Math.PI);
      gb.renderOrder = 2;
      box.add(gf);
      box.add(gb);
      group.add(box);
    }

    camera.position.set(0, 0.5, 14);
    camera.lookAt(0, 0, 0);

    let targetOffset = new THREE.Vector3(0, 0, 0);
    let currentOffset = new THREE.Vector3(0, 0, 0);
    
    window.addEventListener('pointermove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetOffset.set(nx * 0.25, -ny * 0.15, 0);
    });

    const clock = new THREE.Clock();
    let fadeStartTime = 0;

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize);

    function animate() {
      const t = clock.getElapsedTime();
      const localT = t - fadeStartTime;
      const omega = (Math.PI * 2) / rotationPeriod;
      group.rotation.y = t * omega;
    
      currentOffset.lerp(targetOffset, 0.06);
      camera.position.x = currentOffset.x;
      camera.position.y = 0.6 + currentOffset.y;
      camera.lookAt(0, 0, 0);
    
      for (let i = 0; i < group.children.length; i++) {
        const mesh = group.children[i] as THREE.Mesh;
        const mFront = Array.isArray(mesh.material) ? mesh.material[4] : mesh.material;
        const mBack = Array.isArray(mesh.material) ? mesh.material[5] : mesh.material;
        const start = i * 0.1;
        const u = Math.max(0, Math.min(1, (localT - start) / 0.8));
        (mFront as THREE.MeshStandardMaterial).opacity = u;
        if (mBack) (mBack as THREE.MeshStandardMaterial).opacity = u;
      }
    
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
    setIsLoaded(true);

    (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery/images`);
        const data = await response.json();
        if (data.success && data.images && data.images.length > 0) {
          const urls = data.images.slice(0, 10).map((img: GalleryImage) => `${API_BASE_URL}${img.url}`);
          applyLocalImages(urls);
        } else {
          loadDefaultImages();
        }
      } catch {
        loadDefaultImages();
      }
    })();

    function loadDefaultImages() {
      // Since we're using backend images now, just use placeholder textures
      // The backend images will be loaded via the loadBackendImages function
      for (let i = 0; i < 10; i++) {
        const label = `Image${String(i + 1).padStart(2, '0')}`;
        const tex = makePlaceholderTexture(label);
        const mesh = group.children[i] as THREE.Mesh;
        const mFront = Array.isArray(mesh.material) ? mesh.material[4] : mesh.material;
        const mBack = Array.isArray(mesh.material) ? mesh.material[5] : mesh.material;
        (mFront as THREE.MeshStandardMaterial).map = tex;
        (mFront as THREE.MeshStandardMaterial).needsUpdate = true;
        (mFront as THREE.MeshStandardMaterial).opacity = 0;
        if (mBack) {
          (mBack as THREE.MeshStandardMaterial).map = tex;
          (mBack as THREE.MeshStandardMaterial).needsUpdate = true;
          (mBack as THREE.MeshStandardMaterial).opacity = 0;
        }
      }
      fadeStartTime = clock.getElapsedTime();
    }

    function applyLocalImages(imageUrls: string[]) {
      setUseDefaultImages(false);
      for (let i = 0; i < Math.min(imageUrls.length, 10); i++) {
        const url = imageUrls[i];
        loader.load(url, (origTex) => {
          const tex = enhanceTexture(origTex, { contrast: 1.18, brightness: 1.06, saturation: 1.06 });
          origTex.dispose();
          const mesh = group.children[i] as THREE.Mesh;
          const mFront = Array.isArray(mesh.material) ? (mesh.material[4] as THREE.MeshStandardMaterial) : (mesh.material as THREE.MeshStandardMaterial);
          const mBack = Array.isArray(mesh.material) ? (mesh.material[5] as THREE.MeshStandardMaterial) : (mesh.material as THREE.MeshStandardMaterial);
          mFront.map = tex;
          mFront.needsUpdate = true;
          mFront.opacity = 0;
          if (mBack) {
            mBack.map = tex;
            mBack.needsUpdate = true;
            mBack.opacity = 0;
          }
        }, undefined, () => {});
      }
      fadeStartTime = clock.getElapsedTime();
    }

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('dragenter', handleDragEnter);
        mountRef.current.removeEventListener('dragleave', handleDragLeave);
        mountRef.current.removeEventListener('dragover', handleDragOver);
        mountRef.current.removeEventListener('drop', handleDrop);
      }
      renderer.setAnimationLoop(null);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [customImages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/')).slice(0, 10);
    
    // Upload to backend instead of using local URLs
    await uploadImagesToBackend(imageFiles);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* 3D Gallery Container */}
          <div 
            ref={mountRef} 
            className="w-full h-[600px] md:h-[700px] lg:h-[800px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-100 to-gray-200"
            style={{ minHeight: '600px' }}
          />

          {/* Loading Overlay */}
          {(!isLoaded || isLoadingBackend) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-20 rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">
                  {isLoadingBackend ? 'Loading images from server...' : 'Loading 3D Gallery...'}
                </p>
              </div>
            </div>
          )}

          



          {/* Drag overlay */}
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-400 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none" id="drag-overlay">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-blue-700 font-medium text-lg">Drop images here to add them to the gallery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery3D;