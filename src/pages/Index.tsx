import { useState } from "react";

const DISTRICTS = [
  "Аван",
  "Арабкир",
  "Ачапняк",
  "Давташен",
  "Канакер-Зейтун",
  "Кентрон (Центр)",
  "Малатия-Себастия",
  "Нор-Норк",
  "Норк-Мараш",
  "Шенгавит",
  "Эребуни",
  "Нубарашен",
];

const CONTACT_METHODS = ["Viber", "WhatsApp", "Telegram", "Звонок"];

type FormData = {
  districts: string[];
  propertyType: string[];
  moveDate: string;
  rentalPeriod: string;
  rentalPeriodOther: string;
  residents: string;
  residentsOther: string;
  hasChildren: string;
  hasPets: string;
  budget: string;
  rooms: string;
  wishes: string;
  contact: string;
  contactMethod: string;
  contactMethodOther: string;
};

const initialForm: FormData = {
  districts: [],
  propertyType: [],
  moveDate: "",
  rentalPeriod: "",
  rentalPeriodOther: "",
  residents: "",
  residentsOther: "",
  hasChildren: "",
  hasPets: "",
  budget: "",
  rooms: "",
  wishes: "",
  contact: "",
  contactMethod: "",
  contactMethodOther: "",
};

export default function Index() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const toggleDistrict = (d: string) => {
    setForm((f) => ({
      ...f,
      districts: f.districts.includes(d)
        ? f.districts.filter((x) => x !== d)
        : [...f.districts, d],
    }));
  };

  const toggleProperty = (p: string) => {
    setForm((f) => ({
      ...f,
      propertyType: f.propertyType.includes(p)
        ? f.propertyType.filter((x) => x !== p)
        : [...f.propertyType, p],
    }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormData, boolean>> = {};
    if (form.districts.length === 0) e.districts = true;
    if (form.propertyType.length === 0) e.propertyType = true;
    if (!form.moveDate) e.moveDate = true;
    if (!form.rentalPeriod) e.rentalPeriod = true;
    if (!form.residents) e.residents = true;
    if (!form.hasChildren) e.hasChildren = true;
    if (!form.hasPets) e.hasPets = true;
    if (!form.budget) e.budget = true;
    if (!form.rooms) e.rooms = true;
    if (!form.contact) e.contact = true;
    if (!form.contactMethod) e.contactMethod = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="wse-bg min-h-screen flex items-center justify-center p-4">
        <div className="wse-card text-center py-12 px-8 max-w-sm w-full">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Заявка отправлена!</h2>
          <p className="text-gray-600 mb-6">Мы свяжемся с вами в ближайшее время и подберём лучший вариант жилья.</p>
          <button onClick={handleReset} className="wse-btn w-full">Подать новую заявку</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wse-bg min-h-screen pb-10">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="wse-card mb-0 rounded-b-none border-b-0 pt-6 pb-4 px-6 text-center">
          <img
            src="https://cdn.poehali.dev/projects/fe1d4bc1-5037-4578-92f4-e1dbcc533e18/bucket/2159aaa5-3e02-4a2a-bfaa-96d147435277.jpg"
            alt="WSE"
            className="h-14 object-contain mx-auto mb-4"
          />
          <div className="wse-orange-bar mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 text-left leading-tight">
            Заявка на аренду квартиры/дома в Ереване
          </h1>
          <p className="text-gray-600 text-left mt-3 text-sm leading-relaxed">
            Заявка на аренду квартиры/дома в Ереване. Заполните форму и мы найдем для вас лучшую квартиру для жизни в Армении.
          </p>
          <p className="text-gray-600 text-left mt-2 text-sm">
            Если возникнут вопросы:<br />
            <span className="font-semibold">+374 95 129 260</span>
          </p>
        </div>

        <div className="wse-card mb-0 rounded-none border-t-0 border-b-0 px-6 py-3">
          <p className="text-[#E8430A] text-sm font-medium">*Обязательный вопрос</p>
        </div>

        {/* 1. Районы */}
        <div className={`wse-card rounded-none border-t-0 px-6 py-5 ${errors.districts ? "border-l-4 border-l-[#E8430A]" : ""}`}>
          <p className="wse-question">1. Выберите район <span className="text-[#E8430A]">*</span></p>
          <img
            src="https://cdn.poehali.dev/projects/fe1d4bc1-5037-4578-92f4-e1dbcc533e18/bucket/61f0cde3-4835-4884-b5c7-71445d96b2c6.png"
            alt="Карта районов Еревана"
            className="w-full rounded-lg mb-4 border border-gray-100"
          />
          <div className="space-y-3">
            {DISTRICTS.map((d) => (
              <label key={d} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => toggleDistrict(d)}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    form.districts.includes(d)
                      ? "bg-[#E8430A] border-[#E8430A]"
                      : "border-gray-400 group-hover:border-[#E8430A]"
                  }`}
                >
                  {form.districts.includes(d) && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => toggleDistrict(d)}
                  className="text-gray-800 text-base"
                >
                  {d}
                </span>
              </label>
            ))}
          </div>
          {errors.districts && <p className="text-[#E8430A] text-xs mt-2">Выберите хотя бы один район</p>}
        </div>

        {/* 2. Тип жилья */}
        <QuestionCard error={errors.propertyType}>
          <p className="wse-question">2. Квартира или дом? <span className="text-[#E8430A]">*</span></p>
          <div className="space-y-3">
            {["Квартира", "Дом"].map((p) => (
              <label key={p} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => toggleProperty(p)}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    form.propertyType.includes(p)
                      ? "bg-[#E8430A] border-[#E8430A]"
                      : "border-gray-400 group-hover:border-[#E8430A]"
                  }`}
                >
                  {form.propertyType.includes(p) && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span onClick={() => toggleProperty(p)} className="text-gray-800 text-base">{p}</span>
              </label>
            ))}
          </div>
          {errors.propertyType && <p className="text-[#E8430A] text-xs mt-2">Обязательное поле</p>}
        </QuestionCard>

        {/* 3. Дата заезда */}
        <QuestionCard error={errors.moveDate}>
          <p className="wse-question">3. Дата заезда (приблизительно) <span className="text-[#E8430A]">*</span></p>
          <input
            type="date"
            value={form.moveDate}
            onChange={(e) => setForm((f) => ({ ...f, moveDate: e.target.value }))}
            className="wse-input"
          />
          {errors.moveDate && <p className="text-[#E8430A] text-xs mt-1">Обязательное поле</p>}
        </QuestionCard>

        {/* 4. Срок аренды */}
        <QuestionCard error={errors.rentalPeriod}>
          <p className="wse-question">4. Срок аренды <span className="text-[#E8430A]">*</span></p>
          <div className="space-y-3">
            {["6 месяцев", "1 год"].map((opt) => (
              <RadioOption
                key={opt}
                label={opt}
                checked={form.rentalPeriod === opt}
                onChange={() => setForm((f) => ({ ...f, rentalPeriod: opt, rentalPeriodOther: "" }))}
              />
            ))}
            <div className="flex items-center gap-3">
              <RadioDot
                checked={form.rentalPeriod === "other"}
                onChange={() => setForm((f) => ({ ...f, rentalPeriod: "other" }))}
              />
              <span className="text-gray-600 text-sm mr-2 whitespace-nowrap">Другое:</span>
              <input
                type="text"
                placeholder=""
                value={form.rentalPeriodOther}
                onFocus={() => setForm((f) => ({ ...f, rentalPeriod: "other" }))}
                onChange={(e) => setForm((f) => ({ ...f, rentalPeriodOther: e.target.value, rentalPeriod: "other" }))}
                className="wse-input-inline"
              />
            </div>
          </div>
          {errors.rentalPeriod && <p className="text-[#E8430A] text-xs mt-2">Обязательное поле</p>}
        </QuestionCard>

        {/* 5. Число жильцов */}
        <QuestionCard error={errors.residents}>
          <p className="wse-question">5. Число жильцов <span className="text-[#E8430A]">*</span></p>
          <div className="space-y-3">
            {["1", "2", "3"].map((opt) => (
              <RadioOption
                key={opt}
                label={opt}
                checked={form.residents === opt}
                onChange={() => setForm((f) => ({ ...f, residents: opt, residentsOther: "" }))}
              />
            ))}
            <div className="flex items-center gap-3">
              <RadioDot
                checked={form.residents === "other"}
                onChange={() => setForm((f) => ({ ...f, residents: "other" }))}
              />
              <span className="text-gray-600 text-sm mr-2 whitespace-nowrap">Другое:</span>
              <input
                type="text"
                value={form.residentsOther}
                onFocus={() => setForm((f) => ({ ...f, residents: "other" }))}
                onChange={(e) => setForm((f) => ({ ...f, residentsOther: e.target.value, residents: "other" }))}
                className="wse-input-inline"
              />
            </div>
          </div>
          {errors.residents && <p className="text-[#E8430A] text-xs mt-2">Обязательное поле</p>}
        </QuestionCard>

        {/* 6. Дети */}
        <QuestionCard error={errors.hasChildren}>
          <p className="wse-question">6. Наличие детей <span className="text-[#E8430A]">*</span></p>
          <div className="space-y-3">
            {["С детьми", "Без детей"].map((opt) => (
              <RadioOption
                key={opt}
                label={opt}
                checked={form.hasChildren === opt}
                onChange={() => setForm((f) => ({ ...f, hasChildren: opt }))}
              />
            ))}
          </div>
          {errors.hasChildren && <p className="text-[#E8430A] text-xs mt-2">Обязательное поле</p>}
        </QuestionCard>

        {/* 7. Питомцы */}
        <QuestionCard error={errors.hasPets}>
          <p className="wse-question">7. Наличие питомцев <span className="text-[#E8430A]">*</span></p>
          <div className="space-y-3">
            {["С питомцами", "Без питомцев"].map((opt) => (
              <RadioOption
                key={opt}
                label={opt}
                checked={form.hasPets === opt}
                onChange={() => setForm((f) => ({ ...f, hasPets: opt }))}
              />
            ))}
          </div>
          {errors.hasPets && <p className="text-[#E8430A] text-xs mt-2">Обязательное поле</p>}
        </QuestionCard>

        {/* 8. Бюджет */}
        <QuestionCard error={errors.budget}>
          <p className="wse-question">8. Максимальный бюджет <span className="text-[#E8430A]">*</span></p>
          <p className="text-gray-500 text-sm mb-3">(в AMD или USD)</p>
          <input
            type="text"
            placeholder="Мой ответ"
            value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
            className="wse-input"
          />
          {errors.budget && <p className="text-[#E8430A] text-xs mt-1">Обязательное поле</p>}
        </QuestionCard>

        {/* 9. Количество комнат */}
        <QuestionCard error={errors.rooms}>
          <p className="wse-question">9. Количество комнат <span className="text-[#E8430A]">*</span></p>
          <input
            type="text"
            placeholder="Мой ответ"
            value={form.rooms}
            onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))}
            className="wse-input"
          />
          {errors.rooms && <p className="text-[#E8430A] text-xs mt-1">Обязательное поле</p>}
        </QuestionCard>

        {/* 10. Пожелания */}
        <QuestionCard>
          <p className="wse-question">10. Ваши пожелания и всё, что считаете важным</p>
          <textarea
            placeholder="Мой ответ"
            value={form.wishes}
            onChange={(e) => setForm((f) => ({ ...f, wishes: e.target.value }))}
            rows={3}
            className="wse-input resize-none"
          />
        </QuestionCard>

        {/* 11. Контакт */}
        <QuestionCard error={errors.contact}>
          <p className="wse-question">11. Как с вами связаться? <span className="text-[#E8430A]">*</span></p>
          <p className="text-gray-500 text-sm mb-3">(укажите номер или ник в Telegram)</p>
          <input
            type="text"
            placeholder="Мой ответ"
            value={form.contact}
            onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
            className="wse-input"
          />
          {errors.contact && <p className="text-[#E8430A] text-xs mt-1">Обязательное поле</p>}
        </QuestionCard>

        {/* 12. Способ связи */}
        <QuestionCard error={errors.contactMethod}>
          <p className="wse-question">12. Укажите удобный способ связи <span className="text-[#E8430A]">*</span></p>
          <div className="space-y-3">
            {CONTACT_METHODS.map((opt) => (
              <RadioOption
                key={opt}
                label={opt}
                checked={form.contactMethod === opt}
                onChange={() => setForm((f) => ({ ...f, contactMethod: opt, contactMethodOther: "" }))}
              />
            ))}
            <div className="flex items-center gap-3">
              <RadioDot
                checked={form.contactMethod === "other"}
                onChange={() => setForm((f) => ({ ...f, contactMethod: "other" }))}
              />
              <span className="text-gray-600 text-sm mr-2 whitespace-nowrap">Другое:</span>
              <input
                type="text"
                value={form.contactMethodOther}
                onFocus={() => setForm((f) => ({ ...f, contactMethod: "other" }))}
                onChange={(e) => setForm((f) => ({ ...f, contactMethodOther: e.target.value, contactMethod: "other" }))}
                className="wse-input-inline"
              />
            </div>
          </div>
          {errors.contactMethod && <p className="text-[#E8430A] text-xs mt-2">Обязательное поле</p>}
        </QuestionCard>

        {/* Footer note */}
        <div className="px-4 py-4 text-center text-sm text-gray-500">
          Ваши ответы будут отправлены менеджеру WSE
        </div>

        {/* Actions */}
        <div className="px-4 flex items-center gap-6">
          <button onClick={handleSubmit} className="wse-btn px-8">
            Отправить
          </button>
          <button
            onClick={handleReset}
            className="text-[#E8430A] font-medium text-sm hover:underline"
          >
            Очистить форму
          </button>
        </div>

      </div>
    </div>
  );
}

function QuestionCard({ children, error }: { children: React.ReactNode; error?: boolean }) {
  return (
    <div className={`wse-card rounded-none border-t-0 px-6 py-5 ${error ? "border-l-4 border-l-[#E8430A]" : ""}`}>
      {children}
    </div>
  );
}

function RadioDot({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${
        checked ? "border-[#E8430A]" : "border-gray-400 hover:border-[#E8430A]"
      }`}
    >
      {checked && <div className="w-2.5 h-2.5 rounded-full bg-[#E8430A]" />}
    </div>
  );
}

function RadioOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" onClick={onChange}>
      <RadioDot checked={checked} onChange={onChange} />
      <span className="text-gray-800 text-base">{label}</span>
    </label>
  );
}