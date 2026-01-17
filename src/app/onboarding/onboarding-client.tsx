'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Technology, Domain, BusinessModel, UserProfile } from '@/types';
import styles from './onboarding.module.css';

const TECH_OPTIONS: Technology[] = [
  'ai_ml', 'blockchain', 'iot', 'mobile_app', 'web_platform', 
  'ar_vr', 'biotech', 'robotics'
];

const DOMAIN_OPTIONS: Domain[] = [
  'climate', 'health', 'ai_safety', 'social_impact',
  'fintech', 'edtech', 'cybersecurity', 'food_agriculture'
];

const BUSINESS_MODEL_OPTIONS: BusinessModel[] = [
  'b2b_saas', 'b2c_subscription', 'marketplace', 'api_service',
  'consultancy', 'edtech_platform', 'hardware_software', 'nonprofit_impact'
];

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [skills, setSkills] = useState<Technology[]>([]);
  const [experience, setExperience] = useState<string[]>(['']);
  const [expertise, setExpertise] = useState<Domain[]>([]);
  const [industries, setIndustries] = useState<string[]>(['']);
  const [painPoints, setPainPoints] = useState<string[]>(['']);
  const [network, setNetwork] = useState({
    investors: false,
    technical_cofounders: false,
    domain_experts: [] as string[],
    enterprise_contacts: false,
  });
  const [resources, setResources] = useState<{
    budget: 'bootstrap' | 'seed_funded' | 'well_funded';
    time: 'nights_weekends' | 'part_time' | 'full_time';
    unique_access: string[];
  }>({
    budget: 'bootstrap',
    time: 'nights_weekends',
    unique_access: [],
  });
  const [passions, setPassions] = useState<string[]>(['']);
  const [strengths, setStrengths] = useState<string[]>(['']);
  const [marketNeeds, setMarketNeeds] = useState<string[]>(['']);
  const [monetizationPrefs, setMonetizationPrefs] = useState<BusinessModel[]>([]);

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const profileData = {
      skills,
      experience: experience.filter(e => e.trim()),
      expertise,
      industries: industries.filter(i => i.trim()),
      pain_points: painPoints.filter(p => p.trim()),
      network,
      resources,
      passions: passions.filter(p => p.trim()),
      strengths: strengths.filter(s => s.trim()),
      market_needs: marketNeeds.filter(m => m.trim()),
      monetization_prefs: monetizationPrefs,
    };

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        router.push('/generate?onboarded=true');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill: Technology) => {
    setSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleDomain = (domain: Domain) => {
    setExpertise(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const toggleBusinessModel = (model: BusinessModel) => {
    setMonetizationPrefs(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const updateArrayField = (
    arr: string[],
    setter: (arr: string[]) => void,
    index: number,
    value: string
  ) => {
    const newArr = [...arr];
    newArr[index] = value;
    setter(newArr);
  };

  const addArrayField = (arr: string[], setter: (arr: string[]) => void) => {
    setter([...arr, '']);
  };

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>
          Step {step} of {totalSteps}
        </div>
      </div>

      {/* Step Content */}
      <div className={styles.stepContent}>
        {step === 1 && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>👋 Welcome to Context-Aware Generation</h2>
            <p className={styles.stepDescription}>
              Let's personalize your startup idea generator based on <strong>Effectuation</strong> principles.
              We'll capture your unique assets to generate ideas you can actually build.
            </p>
            
            <div className={styles.infoBox}>
              <h3>🎯 What We'll Ask:</h3>
              <ul>
                <li><strong>Who am I?</strong> Skills & experience</li>
                <li><strong>What do I know?</strong> Domain expertise</li>
                <li><strong>Who do I know?</strong> Network & connections</li>
                <li><strong>What do I have?</strong> Resources & access</li>
                <li><strong>Ikigai:</strong> Passions & purpose</li>
              </ul>
            </div>

            <p className={styles.stepHint}>
              ⏱️ Takes ~5 minutes. Your data stays private and secure.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>🧠 Who Am I? (Skills & Experience)</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Technical Skills</label>
              <div className={styles.chipGrid}>
                {TECH_OPTIONS.map(tech => (
                  <button
                    key={tech}
                    className={`${styles.chip} ${skills.includes(tech) ? styles.chipActive : ''}`}
                    onClick={() => toggleSkill(tech)}
                    type="button"
                  >
                    {tech.replace(/_/g, ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Past Experience (e.g., "5 years in fintech")</label>
              {experience.map((exp, i) => (
                <input
                  key={i}
                  type="text"
                  className={styles.input}
                  value={exp}
                  onChange={(e) => updateArrayField(experience, setExperience, i, e.target.value)}
                  placeholder="Describe your experience..."
                />
              ))}
              <button 
                className={styles.addButton}
                onClick={() => addArrayField(experience, setExperience)}
                type="button"
              >
                + Add More
              </button>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Domain Expertise</label>
              <div className={styles.chipGrid}>
                {DOMAIN_OPTIONS.map(domain => (
                  <button
                    key={domain}
                    className={`${styles.chip} ${expertise.includes(domain) ? styles.chipActive : ''}`}
                    onClick={() => toggleDomain(domain)}
                    type="button"
                  >
                    {domain.replace(/_/g, ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>📚 What Do I Know? (Domain Knowledge)</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Industries You've Worked In</label>
              {industries.map((industry, i) => (
                <input
                  key={i}
                  type="text"
                  className={styles.input}
                  value={industry}
                  onChange={(e) => updateArrayField(industries, setIndustries, i, e.target.value)}
                  placeholder="e.g., Healthcare SaaS, E-commerce"
                />
              ))}
              <button 
                className={styles.addButton}
                onClick={() => addArrayField(industries, setIndustries)}
                type="button"
              >
                + Add Industry
              </button>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Pain Points You've Personally Observed</label>
              <p className={styles.hint}>Problems you've faced or seen others struggle with</p>
              {painPoints.map((pain, i) => (
                <textarea
                  key={i}
                  className={styles.textarea}
                  value={pain}
                  onChange={(e) => updateArrayField(painPoints, setPainPoints, i, e.target.value)}
                  placeholder="Describe a specific problem..."
                  rows={3}
                />
              ))}
              <button 
                className={styles.addButton}
                onClick={() => addArrayField(painPoints, setPainPoints)}
                type="button"
              >
                + Add Pain Point
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>🤝 Who Do I Know? (Network)</h2>
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={network.investors}
                  onChange={(e) => setNetwork({...network, investors: e.target.checked})}
                />
                <span>I have access to investors or angel networks</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={network.technical_cofounders}
                  onChange={(e) => setNetwork({...network, technical_cofounders: e.target.checked})}
                />
                <span>I know potential technical co-founders</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={network.enterprise_contacts}
                  onChange={(e) => setNetwork({...network, enterprise_contacts: e.target.checked})}
                />
                <span>I have enterprise/B2B contacts for customer discovery</span>
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Domain Experts in My Network</label>
              <p className={styles.hint}>e.g., "doctors", "lawyers", "teachers"</p>
              <input
                type="text"
                className={styles.input}
                value={network.domain_experts.join(', ')}
                onChange={(e) => setNetwork({
                  ...network,
                  domain_experts: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="doctors, teachers, engineers..."
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>💰 What Do I Have? (Resources)</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Budget / Funding Status</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="budget"
                    checked={resources.budget === 'bootstrap'}
                    onChange={() => setResources({...resources, budget: 'bootstrap'})}
                  />
                  <span>Bootstrap (self-funded)</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="budget"
                    checked={resources.budget === 'seed_funded'}
                    onChange={() => setResources({...resources, budget: 'seed_funded'})}
                  />
                  <span>Seed funded ($50K-$500K)</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="budget"
                    checked={resources.budget === 'well_funded'}
                    onChange={() => setResources({...resources, budget: 'well_funded'})}
                  />
                  <span>Well funded ($500K+)</span>
                </label>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Time Commitment</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="time"
                    checked={resources.time === 'nights_weekends'}
                    onChange={() => setResources({...resources, time: 'nights_weekends'})}
                  />
                  <span>Nights & weekends</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="time"
                    checked={resources.time === 'part_time'}
                    onChange={() => setResources({...resources, time: 'part_time'})}
                  />
                  <span>Part-time (20-30 hrs/week)</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="time"
                    checked={resources.time === 'full_time'}
                    onChange={() => setResources({...resources, time: 'full_time'})}
                  />
                  <span>Full-time (40+ hrs/week)</span>
                </label>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Unique Access / Assets (Optional)</label>
              <p className={styles.hint}>e.g., "hospital data", "university lab access", "influencer network"</p>
              <input
                type="text"
                className={styles.input}
                value={resources.unique_access.join(', ')}
                onChange={(e) => setResources({
                  ...resources,
                  unique_access: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="Describe any unique access you have..."
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>🎯 Ikigai: Finding Your Purpose</h2>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>What Do You Love Doing? (Passions)</label>
              {passions.map((passion, i) => (
                <input
                  key={i}
                  type="text"
                  className={styles.input}
                  value={passion}
                  onChange={(e) => updateArrayField(passions, setPassions, i, e.target.value)}
                  placeholder="e.g., teaching, building products, data analysis..."
                />
              ))}
              <button 
                className={styles.addButton}
                onClick={() => addArrayField(passions, setPassions)}
                type="button"
              >
                + Add Passion
              </button>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>What Are You Good At? (Strengths)</label>
              {strengths.map((strength, i) => (
                <input
                  key={i}
                  type="text"
                  className={styles.input}
                  value={strength}
                  onChange={(e) => updateArrayField(strengths, setStrengths, i, e.target.value)}
                  placeholder="e.g., problem solving, design, sales..."
                />
              ))}
              <button 
                className={styles.addButton}
                onClick={() => addArrayField(strengths, setStrengths)}
                type="button"
              >
                + Add Strength
              </button>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>What Does the World Need? (from your POV)</label>
              {marketNeeds.map((need, i) => (
                <input
                  key={i}
                  type="text"
                  className={styles.input}
                  value={need}
                  onChange={(e) => updateArrayField(marketNeeds, setMarketNeeds, i, e.target.value)}
                  placeholder="e.g., climate solutions, mental health support..."
                />
              ))}
              <button 
                className={styles.addButton}
                onClick={() => addArrayField(marketNeeds, setMarketNeeds)}
                type="button"
              >
                + Add Need
              </button>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Preferred Business Models</label>
              <div className={styles.chipGrid}>
                {BUSINESS_MODEL_OPTIONS.map(model => (
                  <button
                    key={model}
                    className={`${styles.chip} ${monetizationPrefs.includes(model) ? styles.chipActive : ''}`}
                    onClick={() => toggleBusinessModel(model)}
                    type="button"
                  >
                    {model.replace(/_/g, ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        {step > 1 && (
          <button onClick={handleBack} className={styles.backButton}>
            ← Back
          </button>
        )}
        
        {step < totalSteps ? (
          <button onClick={handleNext} className={styles.nextButton}>
            Next →
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : '🚀 Complete Onboarding'}
          </button>
        )}
      </div>
    </div>
  );
}
